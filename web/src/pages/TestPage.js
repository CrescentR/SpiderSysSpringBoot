export {};
// import React,{ useEffect,useMemo,useState } from 'react';
// import axios from 'axios';
//
// const BASE_URL=import.meta.env.VITE_BASE_URL;
// const [tab, setTab] = useState("axios");
// const AjaxTable: React.FC = () => {
//     function AxiosBasicTable(){
//         const [rows,setRows]=useState([]);
//         const [loading,setLoading]=useState(false);
//         const [error,setError]=useState("");
//         const [query,setQuery]=useState("");
//         const [sort,setSort]=useState({key:"name",dir:"asc"});
//         const fetchTableData = async() =>{
//             setLoading(true);
//             setError("");
//             try{
//                 const { data } = await axios.get(BASE_URL+"/getById/1",{});
//                 setRows(Array.isArray(data)?data:[]);
//             }catch(e){
//                 setError("请求失败，已使用本地模拟数据。");
//                 await new Promise((r) => setTimeout(r, 500));
//             }finally{
//                 setLoading(false);
//             }
//         }
//     }
// }
