import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// ヘッダー
import Header from '../components/header/Header';
// フレーム
import MenuFlame from '../flame/web/MenuFlame';
import ComparisonFlame from '../flame/web/ComparisonFlame';
import Err from '../flame/mobile/Err';
// コンポーネント
import Home from '../components/home/Home';
import Detail from '../components/detail/Detail';
import LifeList from '../components/lifeList/LifeList';
import JsonPlan from '../components/json/JsonPlan';
// 不要インポート
import InvestmentGraphFlame from '../flame/web/InvestmentGraphFlame';

const Router = () => {
    if (window.parent.screen.width <= 1600) {
        // スマホorタブレット
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={
                        <Err
                            title="モバイル未対応"
                            errMsg="現在、モバイルには未対応です"
                        />
                    } />
                </Routes>
            </BrowserRouter>
        )
    } else {
        // PC
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Header />
                            <MenuFlame
                                component={<Home />} />
                        </>
                    } />
                    <Route path="/json" element={
                        <>
                            <Header />
                            <MenuFlame
                                component={<JsonPlan />} />
                        </>
                    } />
                    <Route path="/comparison" element={
                        <>
                            <Header />
                            <ComparisonFlame />
                        </>
                    } />
                    <Route path="/investment" element={
                        <>
                            <Header />
                            <InvestmentGraphFlame/>
                        </>
                    } />
                    <Route path="/life/:lifeId" element={
                        <>
                            <Header />
                            <MenuFlame
                                component={<LifeList />} />
                        </>
                    } />
                    <Route path="/life/:lifeId/:year" element={
                        <>
                            <Header />
                            <MenuFlame
                                component={<Detail />} />
                        </>
                    } />
                </Routes>
            </BrowserRouter>
        )
    }
}

export default Router;
