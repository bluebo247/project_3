# 등산을 위한 백대명산 소개 사이트 README
![image](https://github.com/bluebo247/project_3/assets/153582101/a17cdd18-dfd0-4c19-afda-7d790e39205f)
 배포 URL : 현재 미배포상태.


 ## 프로젝트 소개
 + 백대명산의 정보 알고싶어하는 등산러들에게 산에대한 정보 및 정보를 공유할수있는 사이트입니다.
 + 백대명산의 상세정보, 날씨, 해발고도, 위치, 지도, 산의 형태 등을 제공하며, 위치기반 주변 캠핑장의 정보까지 제공하려했음. (하지만 4차프로젝트의 주제를 캠핑으로 변경하는탓에 캠핑장의 정보는 추가하려다 미완성으로 마무리하게됨)

## 개발 기간
 2024.04.05 ~ 2024.05.08

## 팀원 구성 

| **팀장** | **팀원** |
| :------: |  :------: |
| **김대근** | **장준희** |

<br>

## 개발 환경

- Front : HTML, JavaScript, jquery, react
- Back-end : 공공데이터 활용, Nodejs, express, mysql
- 데이터 관리 : oracledb
- 협업 툴 : Discord, Github
- 배포환경 : AWS

## 페이지 소개

### [메인페이지]
- 메인페이지로 접속시 초기화면이며, 풀페이지를 적용하였고, 일정시간마다 이미지가 바뀌도록 설정하였습니다.
-  2번이미지의 Play Video 를 누를경우 등산관련 영상이 재생되도록 구상하였으나, 미완성으로 남아 연결하지는 못했습니다.
![image](https://github.com/bluebo247/project_3/assets/153582101/a17cdd18-dfd0-4c19-afda-7d790e39205f)
![image](https://github.com/bluebo247/project_3/assets/153582101/309c1182-9e3e-4e16-b412-d7f4f3d31c13)

### [카테고리 및 검색페이지]
- 지역별 검색 및 위치별 검색을 사용해 산을 검색할수있습니다.
![image](https://github.com/bluebo247/project_3/assets/153582101/96b2d904-0cf2-4ef8-b82f-18408e337b2f)

##### [지점명 검색(서울/경기)를 이용한 결과]
- 지역별 탭과 산마다 탭을 만들어 상세페이지로 이동이 가능합니다.
![image](https://github.com/bluebo247/project_3/assets/153582101/ff181026-dbd9-4c90-a52b-efcc54ddff88)

##### [위치별 검색(강원도)를 이용한 결과]
- 위치별 또한 산마다 탭을 만들어 상세페이지로 이동이 가능하며, 지도클릭시 지역을 선택가능하고 지역마다 오른쪽의 나오는 지도이미지가 변경됩니다.
![image](https://github.com/bluebo247/project_3/assets/153582101/389b6489-5a58-4042-8fad-4db1cbf20973)

### [상세페이지]
- 산의 상세정보를 나타내는 페이지이며, 산의 대표이미지, 산의이름, 위치, 해발고도, 상세정보,지 등이 나타나게됨.
- 실시간으로 데이터를 불러올수있게 설계되어 작동하게되면 실시간으로 산의 정보 및 날씨등을 불러올수있음.
- 날씨데이터가 실시간이기때문에 풍향및 날씨이미지도 실시간으로 변경가능함.
- 2번째 이미지에 보이는 주변 캠핑장은 4차프로젝트로 인해 미완성으로 남게되었음.
- 2번째 이미지에 보이는 Blog Posts는 웹 크롤링을 이용해 네이버 및 유튜브에서 상세페이지의 산과 관련된 블로그 및 유튜브영상등을 가져오는데 사용했었음.
![image](https://github.com/bluebo247/project_3/assets/153582101/32fc3a25-2300-4524-9d4d-34528f9b90e6)
![image](https://github.com/bluebo247/project_3/assets/153582101/6fbacedd-b091-42b3-b81f-555ff0208f37)

## 추가(보완)할수 있는 기능
- 고도화된 챗봇기능
- 실시간 채팅 추가
- 지도 맵 마커 추가
- 게시판기능 추가
- 캠핑장의 정보 수정
- 블로그 포스트 사용 등
