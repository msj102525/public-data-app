import React, { useState, useEffect, useRef } from "react";
import {Map, MapMarker, MapInfoWindow, Roadview} from 'react-kakao-maps-sdk';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Text  
} from "recharts";

function fetchData(searchYearCd) {

  const endPoint = "https://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle"
  const serviceKey = "dhpm4WohQbiHxw1ohB5lcjV0cLv%2F7SvJ86NTOy4fN%2FGFCwgNhlmj3Hbq%2B2Q7slHN70mQ4DzvKPz9FV4pQr8Ryg%3D%3D"
  const siDo = 11;
  const goGun = 320;
  const type = "json";
  const numOfRows = 10;
  const pageNo = 1;

  
  const promise = fetch(`${endPoint}?serviceKey=${serviceKey}&searchYearCd=${searchYearCd}&siDo=${siDo}&guGun=${goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`)
    .then(res => {
      if (!res.ok) {
        throw res;
      }
      return res.json()
    })

  return promise;

}

export default function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);
  const [searchYearCd, setSearchYearCd] = useState(2020);
  // const [scrolly, setscrolly] = useState(window.scrollY);
  const inputEl = useRef(null);

  

  console.log(data);
  console.log(searchYearCd);


  useEffect(() => {  
    setIsLoaded(false);

    fetchData(searchYearCd)
    .then(data => {
      setData(data);
    })
    .catch(error => {
      setError(error)
    })
    .finally(() => setIsLoaded(true))
  }, [searchYearCd])
  
  //검색
  useEffect(() => {
    if (isLoaded) {
      inputEl.current.focus();
    }
  })

  if (error) {
    return <p>failed to fetch</p>
  }

  if (!isLoaded) {
    return <p>fetching data...</p>
  }

  function handleSubmit(e) {
    e.preventDefault();//새로고침 안함


    // console.log(name);
    setSearchYearCd("")//폼을 Add(제출)하자마자 input칸을 빈칸으로 초기화 

  }
  return (
    <>
      <div className=''>
        <h1 className='flex justify-center items-center w-full text-center text-3xl font-bold mb-4 h-32 bg-gray-600 text-white'>{searchYearCd}년 서울특별시 도봉구 보행자무단횡단 사고 다발지역정보</h1>
      </div>

      <div className='m-4'>
        <h2 className='font-bold text-xl'>조회하실 연도를 선택하십시오</h2>
        <div className='flex items-center h-12'>
          <form onSubmit={handleSubmit}>
            <input type="text"
              placeholder="연도를 입력하세요"
              value={searchYearCd}
              onChange={(e) => setSearchYearCd(e.target.value)}
              autoComplete="off"
              ref={inputEl}//페이지가 새로고침 되어도 input에 포커스됨
              className="border-2 p-2 border-black"
            />
          </form>
        </div>
      </div>

      {data.totalCount > 0 ? (
        <div className='m-4 border border-gray-400'>
          <p className='m-2'>로드뷰를 360°로 확인할 수 있습니다</p>

          <div className="flex">
            <KakaoMap accidents={data.items.item} />
          </div>
        </div>
      ) : (
        <p className='m-4 text-red-600 font-bold'>해당 년도 자료가 없습니다</p>
      )}

      <section>
        {data.totalCount > 0 ? (
          <div className='m-4 border border-gray-400'>

            <h2 className='m-2'>요약</h2>
            <p className='m-2'>총 {data.totalCount}건의 사고가 발생했습니다</p>

            <div className="flex">
              <Rechart accidents={data.items.item} />
            </div>
          </div>
        ) : (
          <p></p>
        )}
      </section>

      <section>
        {/* 댓글 */}
        {data.totalCount > 0 ? (
          <Comment />
        ) : (
          <p></p>
        )}
      </section>

      <Topbutton />

      {data.totalCount > 0 ? (
          <footer className='bg-gray-600' style={{ height: "250px" }}>
          </footer>

      ) : (<p></p>)}
    </>
  )

}


function Rechart({accidents}) {

  const chartData = accidents.map(accident => {
    return {
      name: accident.spot_nm.split(' ')[2] + ")",
      발생건수: accident.occrrnc_cnt,
      사상자수: accident.caslt_cnt,
      사망자수: accident.dth_dnv_cnt
    }
  })

  return (
    <div style={{ height: "450px", width:"50%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend iconSize={10} align="right" layout="vertical" verticalAlign="middle" />
          <Bar dataKey="발생건수" fill="#faa" />
          <Bar dataKey="사상자수" fill="#aaf" />
          <Bar dataKey="사망자수" fill="#faf" />
        </BarChart>
      </ResponsiveContainer>
    </div>    
       
  )
}

function KakaoMap({ accidents }) {
  const [isOpen, setIsOpen] = useState(false)  // 인포윈도우 open 여부

  // mapInfoWindows = 사고난 지점 위치를 텍스토로 보여줌
  const mapInfoWindows = accidents.map(accident => (
    <MapInfoWindow
      key={accident.spot_nm}
      position={{ lat: accident.la_crd, lng: accident.lo_crd }}
      removable={true}
    >
      <div style={{ padding: "5px", color: "#000" }}>
        {accident.spot_nm.split(' ')[2]}
      </div>
    </MapInfoWindow>
  ))

  
  // mapMarkers = 교통사고마커
  // 마우스 오버시 사고난 지점 위치를 인포윈도우로 보여줌

  const mapMarkers = accidents.map(accident =>(
    <MapMarker
    key={accidents.spot_nm}
    position={{ lat: accident.la_crd, lng: accident.lo_crd }}

       image={{
        src: "https://cdn-icons-png.flaticon.com/128/2582/2582937.png", // 마커 이미지의 주소
        size: {
          width: 60,
          height: 60
        }
      }}
      onMouseOver={
        () => setIsOpen(true)
        // 마커에 마우스오버시 인포윈도우를 마커위에 표시함
      }
      onMouseOut={
        () => setIsOpen(false)
      }


    >
      {isOpen && <div style={{ padding: "5px", color: "#000"}}>{mapInfoWindows}<p className='font-bold text-l text-red-500 w-full'>❗ 사고 발생위치 ❗</p></div>}
    </MapMarker>

   
  ))

  return (
    <>
      <Map
        className="w-1/2 m-4"
        center={{ lat: accidents[0].la_crd, lng: accidents[0].lo_crd }}
        level={5}
        style={{
          width: "50%", height: "350px" , 
          borderStyle: "solid", borderWidth: "medium", borderColor: "orange yellow green red"
        }}
      >
        {mapInfoWindows}
        {mapMarkers}
      </Map>
        
    {/* # Roadview 코드 아래에 */}


    <Roadview
      className='w-1/2 m-4'
      position={{
        lat: accidents[0].la_crd,
        lng: accidents[0].lo_crd,
        radius: 50,
      }}

      style={{
       width: "50%",
       height: "350px",
       borderStyle: "solid", borderWidth: "medium", borderColor: "orange yellow green red" 
      }}
     >   
    </Roadview>
  </>
  )
}

// 댓글창

function Comment() {
  return (
    <div className="m-4 h-64 border-t border-gray-400">
      <div className="w-full border border-gray-400 h-60 mt-4">
        <div className="flex p-4">
          <span className="p-2">
            <a href="#">item</a>
          </span>
          <span className="p-2">
            <a href="#">item</a>
          </span>
          <span className="p-2">
            <a href="#">item</a>
          </span>
          <span className="p-2">
            <a href="#">item</a>
          </span>
        </div>
      </div>
    </div>
  )
}

// TOP BUTTON
function Topbutton() {

  const buttonEl = useRef(null);
  
  window.addEventListener("scroll", (e) => {
    console.log(document.documentElement.scrollTop);

    if(document.documentElement.scrollTop > 100) {
      buttonEl.current.classList.remove("hidden");
    } else {
      buttonEl.current.classList.add('hidden');
    }
  })

  function handleClick(e) {
    document.documentElement.scrollTop = 0;
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed right-0 bottom-0 p-2 m-4 bg-stone-200 text-lg font-bold rounded-xl w-12 h-12 hidden"
        ref={buttonEl}
      >
        Top
      </button>
    </>
  )

}
