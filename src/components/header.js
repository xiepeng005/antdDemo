import React from "react";
import ReactDOM from "react-dom";
import { Menu } from 'antd';

class Header extends React.Component{
    constructor(){
        super();
        this.state = {
            current: 'home'
        };
    }
    menuClick(e){
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    };
    render(){
        return(
            <div className="header">
                <div className="fl logo"><img src="/dist/imgs/logo.png"/></div>
                <div className="fr menu">
                    <Menu
                        onClick={this.menuClick}
                        selectedKeys={[this.state.current]}
                        mode="horizontal"
                    >
                        <Menu.Item key="home"><a href="/">首页</a></Menu.Item>
                        <Menu.Item key="about"><a href="/about">关于我们</a></Menu.Item>
                        <Menu.Item key="health"><a href="/health">健康产品</a></Menu.Item>
                        <Menu.Item key="news"><a href="/news">新闻资讯</a></Menu.Item>
                        <Menu.Item key="love"><a href="/love">爱心公益</a></Menu.Item>
                        <Menu.Item key="join"><a href="/join">招商加盟</a></Menu.Item>
                        <Menu.Item key="contact"><a href="/contact">联系我们</a></Menu.Item>
                    </Menu>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Header />, document.getElementById("header"));