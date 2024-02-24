// 페이지네이션
// 1. 페이지네이션 함수 생성 : 속성 값 , 토털리절트, 페이지, 페이지사이즈, 그룹 페이지, 첫 마지막 페이지
// 2. 토털리절트 : API호출 값 인용, 페이지 정보 : 1, 페이지사지이 10, 그룹 사이즈 5로 지정, 함수 고정 
// 3. 페이지 그룹은 계산 : 내가 불러온 페이지/그룹사이즈 (Math 함수)
// 4. 마지막 페이지는 페이지 그룹 곱하기 구릅 페이지, 첫 페이지는 그룹사이즈 빼기 1을 마지막 페이지에서 뺀 값 
// 5. 페이지네이션 모양 부트스트랩 이용, 뉴스 섹션 밑에 페이지 네이션 위치 지정(HTML)
// 6. for문을 사용하여 i값 설정하고 번호를 지정받고 호출 
// 7. 페이네이션 기능 부여(내용 변경), 버튼 클릭시 원하는 내용으로 이동
// 8. 온클릭시 함수 호출 move to page 
// 9. 몇 번째 페이지를 클릭했는지 매개변수롤 통해 정보 확인 
// 10. URL 호출, getNews에 페이지 정보를 같이 준다. (쿼리를 통해 보낸다.) url.serchParams.set(page),(pageSize)
// 11. 마지막 페이지 그룹 사이즈를 5개로 일괄 지정의 문제 해결, 조정 마지막 페이지가 만약에 그룹사이즈보다 작을 경우 마지막 페이지는 토탈페이지로 
// 12. 토탈 페이지는  Math.ceil(totalResults/pageSize)
// 13. 0번 페이지 조정 : 만약에 결과값이 0보다 작거나 같으면 1로 설정 
// 14. 클릭시 번호 인지, 알림표시(파란색 음영), 엑티브 부트스트랩 복사
// 15. 다음페이지 설정기능 (프리비어스, 넥스트), 버튼 복사 
// 16. 버튼 온클릭 기능 부여 , 무브투페이지 함수 사용, 받은 매개변수(${page-1})(${page+1})로 페이지 값 현출
// 17. 1페이지 경우 이전 기능 불필요, 마지막 페이지의 경우 다음 버튼 불필요
// 18. 제을 끝 페이지로 점프하는 기능 부여 

const API_KEY = "b1fe516cb2ff4032b010ec5773f3a973";
let articles = [];
let page = 1;
let totalPage = 1;
const PAGE_SIZE = 10;
// let url = new URL(
//   `https://newsapi.org/v2/top-headlines?country=kr&pageSize=${PAGE_SIZE}`
// );
let url = new URL(
  `https://noona-times-v2.netlify.app/top-headlines?country=kr&pageSize=${PAGE_SIZE}`
);
let menus = document.querySelectorAll("#menu-list button");
menus.forEach((menu) =>
  menu.addEventListener("click", (e) => getNewsByTopic(e))
);

const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    console.log("Rrr", url);
    let response = await fetch(url);
    let data = await response.json();
    if (response.status == 200) {
      console.log("resutl", data);
      if (data.totalResults == 0) {
        page = 0;
        totalPage = 0;
        renderPagination();
        throw new Error("검색어와 일치하는 결과가 없습니다");
      }

      articles = data.articles;
      totalPage = Math.ceil(data.totalResults / PAGE_SIZE);
      render();
      renderPagination();
    } else {
      page = 0;
      totalPage = 0;
      renderPagination();
      throw new Error(data.message);
    }
  } catch (e) {
    errorRender(e.message);
    page = 0;
    totalPage = 0;
    renderPagination();
  }
};
const getLatestNews = () => {
  page = 1; // 9. 새로운거 search마다 1로 리셋
  // url = new URL(
  //   `https://newsapi.org/v2/top-headlines?country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  // );
  url = new URL(
    `https://noona-times-v2.netlify.app/top-headlines?country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  );
  getNews();
};

const getNewsByTopic = (event) => {
  const topic = event.target.textContent.toLowerCase();

  page = 1;
  // url = new URL(
  //   `https://newsapi.org/v2/top-headlines?country=kr&pageSize=${PAGE_SIZE}&category=${topic}&apiKey=${API_KEY}`
  // );
  url = new URL(
    `https://noona-times-v2.netlify.app/top-headlines?country=kr&pageSize=${PAGE_SIZE}&category=${topic}&apiKey=${API_KEY}`
  );
  getNews();
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

const getNewsByKeyword = () => {
  const keyword = document.getElementById("search-input").value;

  page = 1;
  // url = new URL(
  //   `https://newsapi.org/v2/top-headlines?q=${keyword}&country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  // );
  url = new URL(
    `https://noona-times-v2.netlify.app/top-headlines?q=${keyword}&country=kr&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  );
  getNews();
};

const render = () => {
  let resultHTML = articles
    .map((news) => {
      return `<div class="news row">
        <div class="col-lg-4">
            <img class="news-img"
                src="${
                  news.urlToImage ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                }" />
        </div>
        <div class="col-lg-8">
            <a class="title" target="_blank" href="${news.url}">${
        news.title
      }</a>
            <p>${
              news.description == null || news.description == ""
                ? "내용없음"
                : news.description.length > 200
                ? news.description.substring(0, 200) + "..."
                : news.description
            }</p>
            <div>${news.source.name || "no source"}  ${moment(
        news.publishedAt
      ).fromNow()}</div>
        </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = resultHTML;
};
const renderPagination = () => {
  let paginationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if (last > totalPage) {
    last = totalPage;
  }
  let first = last - 4 <= 0 ? 1 : last - 4;
  if (first >= 6) {
    paginationHTML = `<li class="page-item" onclick="pageClick(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="pageClick(${page - 1})">
                        <a class="page-link" href='#js-bottom'>&lt;</a>
                      </li>`;
  }
  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                        <a class="page-link" href='#js-bottom' onclick="pageClick(${i})" >${i}</a>
                       </li>`;
  }

  if (last < totalPage) {
    paginationHTML += `<li class="page-item" onclick="pageClick(${page + 1})">
                        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="pageClick(${totalPage})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const pageClick = (pageNum) => {
  page = pageNum;
  window.scrollTo({ top: 0, behavior: "smooth" });
  getNews();
};
const errorRender = (message) => {
  document.getElementById(
    "news-board"
  ).innerHTML = `<h3 class="text-center alert alert-danger mt-1">${message}</h3>`;
};

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};
getLatestNews();