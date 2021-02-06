import React from "react";
import axios from "axios";
import './app.less';
const MODAL_WIDTH = 350;
/**
 * 鼠标点击modal之外 modal隐藏
 * @param {s} x 鼠标的x轴位置
 * @param {*} y 鼠标的y轴位置
 * @param {*} modalPosition 弹窗的left和top
 */
function boundaryDetection(x,y,modalPosition={left:0,top:0}){
    let {left,top} = modalPosition;
    if(
        x > left &&
        x < left + MODAL_WIDTH &&
        y > top &&
        y < top + SelectSearchApp.offsetHeight
    ){
        return true;
    }
    return false;
}
export default class extends React.Component{
    constructor(props){
        super(props);
        this.state = {show:false};
    }
    componentDidMount(){
        document.addEventListener('mouseup',(e)=>{
            var selectObj = window.getSelection();
            var selectedText =  selectObj.toString();
            console.log('selectText::', selectedText);
            if(selectedText.length === 0){
                if(this.state.show){
                    // 重新计算是否关闭弹窗
                    // 检测鼠标位置是否在弹窗内，不是则关闭弹窗
                    var inModal = boundaryDetection(
                        e.clientX,
                        e.clientY,
                        this.state.modalPosition
                    )
                    if(!inModal){
                        this.setState({
                            show:false,
                            data:[]
                        })
                    }
                }
            }else{
                var selectedObjRange = selectObj.getRangeAt(0).getBoundingClientRect();
                let {x,y,width,height} = selectedObjRange;
                var left = x + width/2 - MODAL_WIDTH/2;
                left = left > 10 ? left : 10;
                var top = y + height;
                var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                axios
                    .get(`https://kaifa.baidu.com/rest/v1/search?query=${selectedText}&pageNum=1&pageSize=10`)
                    .then((res)=>{
                        let {data} = res.data.data.documents;
                        console.log(data);
                        if (data.length) {
                            this.setState({
                                data,
                                show:true,
                                selectedText,
                                modalPosition:{
                                    left:left + scrollLeft,
                                    top:top+scrollTop
                                }
                            })
                        }
                    })
            }
        })
    }
    render(){
        let {show,data,modalPosition,selectedText} = this.state;
        return <>{show ? 
            (<div 
                className="select-search"
                id="SelectSearchApp"
                style={{
                    ...modalPosition
                }}
            >
            <div className="select-search-content">
                <ul className="select-search-ul">
                {
                    data.map((item)=>(
                        <li 
                            className="select-search-li" 
                            key={item.id}
                        >
                            <a href={item.url} target="_blank">
                                {item.title}
                            </a>
                            <span>{item.summary}</span>
                        </li>
                    ))
                }
            </ul>
            </div>
            <div className="select-search-bottom-fade"></div>
            <footer className="select-ssearch-footer">
                <a
                href={`https://kaifa.baidu.com/searchPage?wd=${selectedText}`}
                target="_blank"
              >
                Read More
              </a>
            </footer>
        </div>)
        :null}</>
    }
}