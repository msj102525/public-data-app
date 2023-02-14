import React, { useState, useEffect, useRef } from "react";
import {Map, MapMarker, MapInfoWindow, Roadview} from 'react-kakao-maps-sdk';
import Faultinfo from "./Faultinfo";//과실 비율 내용
import Exampleinfo from "./Exampleinfo";//교통사고 사례 내용
import Punishmentinfo from "./Punishmentinfo";//무단횡단 관련 처벌 법 내용
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
  const [searchYearCd, setSearchYearCd] = useState(2015);
  // const [scrolly, setscrolly] = useState(window.scrollY);
  const inputEl = useRef(null);


  console.log(data);

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
        <h1 className='flex justify-center items-center w-full text-center text-3xl font-bold mb-4 h-32 bg-gray-900 text-white'>{searchYearCd}년 서울특별시 도봉구 보행자무단횡단 사고 다발지역정보</h1>
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
              <Info />
            </div>

          </div>
        ) : (
          <p></p>
        )}
      </section>
     

      <section>
        {data.totalCount > 0 ? (
          <Comment />
        ) : (
          <p></p>
        )}
      </section>

      <Topbutton />

      {data.totalCount > 0 ? 
      
    
      (
          // <footer className='bg-gray-600' style={{ height: "250px" }}>
          //   <img 
          //   src='https://cdn-icons-png.flaticon.com/512/2111/2111463.png'
          //   width='30px'
          //   ></img>
          //   <img 
          //   src='https://cdn-icons-png.flaticon.com/512/4008/4008433.png'
          //   width='30px'
          //   />
          //   <img 
          //   src='https://cdn-icons-png.flaticon.com/512/733/733547.png'
          //   width='30px'
          //   />



          // </footer>
          <div class=" bg-gray-900">
          <div class="max-w-2xl mx-auto text-white py-10">
              <div class="text-center">
              <h3 class="text-3xl mb-3"> Jaywalking accident information app </h3>
              <p> ❕  always be careful.  ❕ </p>
              <div class="flex justify-center my-10">
                    

                    {/* 구글 플레이스토어 다운로드 버튼 */}
                    <button class="flex items-center border w-auto rounded-lg px-4 py-2 w-52 mx-2">
                    <img src="https://cdn-icons-png.flaticon.com/512/888/888857.png" class="w-7 md:w-8"/>
                    <div class="text-left ml-3">
                        <p class='text-xs text-gray-200'>Download on </p>
                        <p class="text-sm md:text-base"> Google Play Store </p>
                    </div>
                    </button>
                    
                    {/* 애플 스토어 다운로드 버튼*/}
                    <button class="flex items-center border w-auto rounded-lg px-4 py-2 w-44 mx-2">
                    <img src="https://cdn-icons-png.flaticon.com/512/888/888841.png" class="w-7 md:w-8"/>
                    <div class="text-left ml-3">
                        <p class='text-xs text-gray-200'>Download on </p>
                        <p class="text-sm md:text-base"> Apple Store </p>
                    </div>
                    </button>
            </div>
        </div>
        <div class="mt-28 flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
            <p class="order-2 md:order-1 mt-8 md:mt-0"> &copy; Beautiful Footer, 2023. </p>
            <div class="order-1 md:order-2">
                <span class="px-2">About us</span>
                <span class="px-2 border-l">Contact us</span>
                <span class="px-2 border-l">Privacy Policy</span>
            </div>
        </div>
    </div>
</div>

      )
       : (<p></p>)} 
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


  // mapInfoWindows = 사고난 지점 위치를 텍스트로 보여줌
  const mapInfoWindows = accidents.map(accident => (
    <MapInfoWindow
      key={accident.spot_nm}
      position={{ lat: accident.la_crd, lng: accident.lo_crd }}
      removable={true}
    >
      <div style={{padding: "5px", color: "#000" ,textAlign: "center"}}>
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
          level={4}
          style={{
            width: "50%", height: "350px" ,
            borderStyle: "solid", borderWidth: "medium", borderColor: "rgb(189, 189, 189)"
          }}
        >
          {/* {mapInfoWindows} */}
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
       borderStyle: "solid", borderWidth: "medium", borderColor: "rgb(189, 189, 189)"
      }}
     >
     </Roadview>
    </>
  )
}


function Info() {
 

  return (
    <>
      <div className='m-2 w-1/2 border-2 border-gray-400'>
        <ul className='flex justify-center m-2'>
          <Fault/>
          <li className='px-4'>|</li>
          <Example/>
          <li className='px-4'>|</li>
          <Punishment/>
        </ul>
        
      </div>
    </>
  )
}


function Fault() {
  const [fault, setFault] = useState(false);
  return (
    <>
    <div className='font-bold'>
      <ul className='flex justify-center items-center m-2'>
        <li>
          <button 
          onClick={()=> {
            setFault(!fault)
          }}
          >
            과실 비율</button>
        </li>
      </ul>
      <div>
        {fault && <Faultinfo />}
      </div>
    </div>
  </>
    ) 
}



function Example() {
  const [example,setExample] = useState(false);
  return (
    <>
    <div className='font-bold'>
      <ul className='flex justify-center items-center m-2'>
        <li>
          <button 
          onClick={()=> {
            setExample(!example)
          }}
          >
            교통 사고 사례</button>
        </li>
      </ul>
      <div>
        {example && <Exampleinfo />}
      </div>
    </div>
  </>
    ) 
}


function Punishment() {
  const [punishment, setPunishment] = useState(false);

  return (
    <>
      <div className='font-bold'>
        <ul className='flex justify-center items-center m-2'>
          <li>
            <button 
            onClick={()=> {
              setPunishment(!punishment)
            }}
            >
              무단횡단 관련 처벌 법</button>
          </li>
        </ul>
        <div>
          {punishment && <Punishmentinfo />}
        </div>
      </div>
    </>
  )
}
//댓글
function Comment() {

  //댓글 입력값 저장
  const [comment, setComment] = useState('');
  const onChange = event => setComment(event.target.value);
  //댓글입력값 저장되는곳
  const [commentArr, setCommentArr] = useState(['무단횡단 하지맙시다']);



  const onSubmit = event => {
    event.preventDefault();
    if (comment === '') {
      return;
    }
    setCommentArr(commentValueList => [comment, ...commentValueList]);
    setComment('');
  };

  return (
    <div className='m-4 border-t border-gray-400'>
      <div className='w-full border border-gray-400 h-60 mt-4 h-fit'>


        <div className='p-4 block' onSubmit={onSubmit}>
          <form className='w-full'>
            <input type="text" placeholder='댓글을 입력하세요' value={comment} onChange={onChange} className='border-2 border-black w-full h-20 p-2'></input>
            <button className='block border-none float-right my-2 p-2 bg-gray-600 text-white'>등록</button>
          </form>
        </div>

        <ul className='w-full m-4'>
          {commentArr.map((value, index) => (
            <li key={index} className="list-none block">
              <div className='mt-6'>
                <span className='font-bold'>익명 </span>
                {value}
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}
//탑버튼
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