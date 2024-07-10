const express = require('express');
const app = express();
const cors =require('cors');
const oracledb = require('oracledb');
const session = require('express-session');

const bodyParser = require('body-parser');

oracledb.autoCommit = true;
oracledb.initOracleClient({ libDir: 'instantclient_21_13' });

const dbConfig = {
    user: 'open_source',
    password: '1111',
    connectString: 'localhost:1521/xe'
};

oracledb.createPool({
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: dbConfig.connectString,
    poolMax: 4, // 최대 연결 수
    poolMin: 0, // 최소 연결 수
    poolIncrement: 1, // 증가할 연결 수
    poolTimeout: 60 // 연결 대기 시간 (초)
}).then(() => {
    console.log("Oracle DB pool created successfully.");
}).catch((err) => {
    console.error("Error creating Oracle DB pool:", err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
}));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/api/mountains', async (req, res) => {
    const region = req.query.region;
        try {

            const connection = await oracledb.getConnection(dbConfig);
            console.log('Connected to Oracle Database');
            let sqlQuery;

            if (region === '서울/경기') {
                sqlQuery = `select id, mt_name, mt_adress from mountain
                where mt_adress like '%서울시%' or
                      mt_adress like '%경기도%' or
                      mt_adress like '%인천광역시%'
                order by id asc`;
            }
            else if (region === '경상북도'){
                sqlQuery = `select id, mt_name, mt_adress from mountain
                where mt_adress like '%경상북도%' or
                      mt_adress like '%대구광역시%'
                order by id asc`;
            }
            else if (region === '경상남도'){
                sqlQuery = `select id, mt_name, mt_adress from mountain
                where mt_adress like '%경상남도%' or
                      mt_adress like '%울산광역시%'
                order by id asc`;
            }
            else if (region === '전라남도'){
                sqlQuery = `select id, mt_name, mt_adress from mountain
                where mt_adress like '%전라남도%' or
                      mt_adress like '%광주광역시%'
                order by id asc`;
            }
            else {
                sqlQuery = `select id, mt_name, mt_adress from mountain
                where mt_adress like '%${region}%'  
                order by id asc`;
            }

            const result = await connection.execute(sqlQuery);


            const mountains = result.rows.map(row => ({
                id: row[0],
                MT_NAME: row[1],
                MT_ADRESS: row[2]
            }));

            res.json(mountains);

            await connection.close();
            console.log('Disconnected from Oracle Database');
        } catch (error) {
            console.error('Error connecting to Oracle Database:', error);
            res.status(500).send('Internal Server Error');
        }
    });

app.get('/api/mountains/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to Oracle Database');

        const result = await connection.execute(
            `SELECT ID, MT_NAME, MT_ADRESS, MT_HEIGHT, MT_INFO ,MT_LATITUDE, MT_LONGITUDE FROM mountain WHERE ID = :id`,
            [id],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Mountain not found" });
        } else {
            const mountain = {
                id: result.rows[0].ID,
                MT_NAME: result.rows[0].MT_NAME,
                MT_ADRESS: result.rows[0].MT_ADRESS,
                MT_HEIGHT: result.rows[0].MT_HEIGHT,
                MT_INFO: result.rows[0].MT_INFO,
                MT_LATITUDE: result.rows[0].MT_LATITUDE,
                MT_LONGITUDE: result.rows[0].MT_LONGITUDE
            };
            res.json(mountain);
        }

        await connection.close();
        console.log('Disconnected from Oracle Database');
    } catch (error) {
        console.error('Error connecting to Oracle Database:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/login', async (req, res) => {
    const { userId, password } = req.body;
    if (!userId || !password) {
        res.status(400).send('User ID and password are required');
        return;
    }

    const authenticatedUser = await verifyID(userId, password);
    console.log(authenticatedUser)
    if (authenticatedUser) {
        res.json({ message: 'Login successful!', user: authenticatedUser });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

async function verifyID(userId, password) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql_query = 'SELECT * FROM mountainusers WHERE USERID = :userId AND PASSWORD = :password';
        const result = await connection.execute(sql_query, [userId, password], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        if (result.rows.length > 0) {
            return {
                id: result.rows[0].ID,
                userid: result.rows[0].USERID,
                nickname: result.rows[0].NICKNAME
            };
        } else {
            return null; // Authentication failed
        }
    } catch (error) {
        console.error('Error occurred: ', error);
        throw error; // Re-throw the error to be handled by the calling function
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

app.post('/api/register', async (req, res) => {
    const { userId, password, nickname, realname } = req.body;

    try {
        const connection = await oracledb.getConnection();
        const query = 'SELECT userId FROM mountainusers WHERE userId = :userId';
        const result = await connection.execute(query, [userId], {outFormat: oracledb.OUT_FORMAT_OBJECT});

        if (result.rows.length > 0) {
            // 이미 등록된 아이디인 경우, 회원가입을 거부하고 오류 메시지 반환
            await connection.close();
            return res.status(400).send('이미 등록된 아이디입니다.');
        }

        const insertResult = await connection.execute(
            `INSERT INTO mountainusers (id, userId, password, nickname, realname) VALUES (mountainusers_seq.NEXTVAL, :userId, :password, :nickname, :realname)`,
            [userId, password, nickname, realname]
        );
        await connection.close();
        console.log('회원가입 성공');
        res.status(200).send('회원가입에 성공했습니다.');
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).send('회원가입에 실패했습니다.');
    }
});

app.get('/api/ChartsAsc', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to Oracle Database');

        // 오름차순 데이터를 가져오는 쿼리 실행
        const ascendingResult = await connection.execute(
            `SELECT name, day, trunc(di) as di
             FROM live_weather
             WHERE TO_CHAR(day, 'HH24') = '09'
             ORDER BY DI ASC`
        );

        // 결과를 객체에 담아서 클라이언트에 전송
        const ascData = ascendingResult.rows.map(row=> ({
            name :row[0],
            day:row[1],
            di:row[2]
        }));
        res.json(ascData);

        await connection.close();
        console.log('Disconnected from Oracle Database');
    } catch (error) {
        console.error('Error connecting to Oracle Database:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/ChartsDesc', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to Oracle Database');

        // 오름차순 데이터를 가져오는 쿼리 실행
        const descendingResult = await connection.execute(
            `SELECT name, day, trunc(di) as di
             FROM live_weather
             WHERE TO_CHAR(day, 'HH24') = '09'
             ORDER BY DI DESC`
        );

        // 결과를 객체에 담아서 클라이언트에 전송
        const descData = descendingResult.rows.map(row=> ({
            name :row[0],
            day:row[1],
            di:row[2]
        }));
        res.json(descData);

        await connection.close();
        console.log('Disconnected from Oracle Database');
    } catch (error) {
        console.error('Error connecting to Oracle Database:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/ChartsHeight', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to Oracle Database');

        const heightResult = await connection.execute(
            `SELECT
                 CASE
                     WHEN mt_height BETWEEN 300 AND 600 THEN '300~600'
                     WHEN mt_height BETWEEN 601 AND 900 THEN '601~900'
                     WHEN mt_height BETWEEN 901 AND 1200 THEN '901~1200'
                     WHEN mt_height > 1200 THEN '1200이상'
                     END AS height_range,
                 COUNT(*) AS count
             FROM
                 mountain
             GROUP BY
                 CASE
                     WHEN mt_height BETWEEN 300 AND 600 THEN 1
                     WHEN mt_height BETWEEN 601 AND 900 THEN 2
                     WHEN mt_height BETWEEN 901 AND 1200 THEN 3
                     WHEN mt_height > 1200 THEN 4
                END, mt_height
            ORDER BY
                MIN(mt_height)`
        );

        // 결과를 객체에 담아서 클라이언트에 전송
        const heightData = heightResult.rows.reduce((acc, row) => {
            const existingRange = acc.find(item => item.name === row[0]);
            if (existingRange) {
                existingRange.count += row[1];
            } else {
                acc.push({ name: row[0], count: row[1] });
            }
            return acc;
        }, []);
        res.json(heightData);

        await connection.close();
        console.log('Disconnected from Oracle Database');
    } catch (error) {
        console.error('Error connecting to Oracle Database:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/ChartsMountain', async (req, res) => {
    try {
        // 클라이언트로부터 범주를 받아옵니다.
        const { category } = req.query;

        const connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `SELECT ID,MT_NAME,MT_ADRESS,MT_HEIGHT FROM mountain WHERE mt_height BETWEEN :min_height AND :max_height ORDER BY mt_height ASC`,
            {
                min_height: category === '300~600' ? 300 : category === '601~900' ? 601 : category === '901~1200' ? 901 : 1200,
                max_height: category === '300~600' ? 600 : category === '601~900' ? 900 : category === '901~1200' ? 1200 : 9999
            }
        );

        const mountainData = result.rows.map(row => ({
            id: row[0],
            MT_NAME: row[1],
            MT_ADRESS: row[2],
            MT_HEIGHT: row[3]
        }));

        res.json(mountainData);

        await connection.close();
    } catch (error) {
        console.error('Error fetching mountain info:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/api/Blog', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to Oracle Database');

        const sqlQuery = `
            SELECT 
                posts.id AS post_id,
                posts.title AS post_title,
                DBMS_LOB.SUBSTR(posts.content, 4000, 1) AS post_content, -- content 컬럼의 첫 4000 문자를 가져옵니다.
                posts.created_at AS post_created,
                posts.views AS post_views,
                posts.likes AS post_likes,
                mountainusers.nickname AS author_nickname
            FROM 
                posts
            INNER JOIN 
                mountainusers 
            ON 
                posts.author_id = mountainusers.id
            ORDER BY
                posts.id ASC
        `;

        const result = await connection.execute(sqlQuery);
        const posts = result.rows.map(row => ({
            id: row[0],
            title: row[1],
            content: row[2],
            author: {
                nickname: row[6],
            },
            created : row[3],
            views : row[4],
            likes : row[5]
        }));

        res.json(posts);

        await connection.close();
        console.log('Disconnected from Oracle Database');
    } catch (error) {
        console.error('Error connecting to Oracle Database:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/tempCharts', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to Oracle Database');

        // 오름차순 데이터를 가져오는 쿼리 실행
        const tempResult = await connection.execute(
            `SELECT l.num, l.name, TO_CHAR(l.day, 'MM-DD HH24') AS day_month, l.temp
        FROM live_weather l
        JOIN mountain m ON l.num = m.num
        WHERE m.id = :mountain_id`
        );

        // 결과를 객체에 담아서 클라이언트에 전송
        const tempData = tempResult.rows.map(row=> ({
            num:row[0],
            name :row[1],
            day:row[2],
            temp:row[3]
        }));
        res.json(tempData);

        await connection.close();
        console.log('Disconnected from Oracle Database');
    } catch (error) {
        console.error('Error connecting to Oracle Database:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/camping', async (req, res) => {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to Oracle Database');

        const result = await connection.execute(
            `SELECT * FROM campi`
        );

        const campi = result.rows.map(row => ({
            ID: row[0],
            NAME: row[1],
            LINEINTRO: row[2],
            INFO: row[3],
            ADDR: row[4],
            LATI: row[5],
            LONGI: row[6],
            TEL: row[7],
            HOMEPAGE: row[8],
            TIPS: row[9],
            GLAM_INNER: row[10],
            CARAVAN_INNER: row[11],
            FACILITY: row[12],
            SUB_FACILITY: row[13],
            IMGURL: row[14],
            // Add other fields as needed
        }));

        res.json(campi);

        await connection.close();
        console.log('Disconnected from Oracle Database');
    } catch (error) {
        console.error('Error connecting to Oracle Database:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/api/camping/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to Oracle Database');

        const result = await connection.execute(
            `SELECT ID, NAME, LINEINTRO, INFO, ADDR, LATI, LONGI, TEL, HOMEPAGE, FACILITY, SUB_FACILITY, IMGURL FROM campi WHERE ID = :id`,
            [id],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Mountain not found" });
        } else {
            const campi = {
                id: result.rows[0].ID,
                NAME: result.rows[0].NAME,
                LINEINTRO: result.rows[0].LINEINTRO,
                INFO: result.rows[0].INFO,
                ADDR: result.rows[0].ADDR,
                LATI: result.rows[0].LATI,
                LONGI: result.rows[0].LONGI,
                TEL: result.rows[0].TEL,
                HOMEPAGE: result.rows[0].HOMEPAGE,
                FACILITY: result.rows[0].FACILITY,
                SUB_FACILITY: result.rows[0].SUB_FACILITY,
                IMGURL: result.rows[0].IMGURL
            };
            res.json(campi);
        }

        await connection.close();
        console.log('Disconnected from Oracle Database');
    } catch (error) {
        console.error('Error connecting to Oracle Database:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(4000);
console.log('server start!!')

