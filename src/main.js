import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAMap from "vue-amap";

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')

// 初始化vue-amap
VueAMap.initAMapApiLoader({
	// 高德的key
	key: '18f1b9d3ca3579707e34e2d1874bc731',
	// 插件集合
	plugin: [
		'AMap.CircleEditor',// 圆形编辑器插件
		"AMap.Geolocation", // 定位控件，用来获取和展示用户主机所在的经纬度位置
		"AMap.Geocoder", // 地理编码与逆地理编码服务，用于地址描述与坐标间的相互转换
		"AMap.Autocomplete",
		"AMap.PlaceSearch",
		"AMap.CitySearch",
	],
	// 高德 sdk 版本
	v: '1.4.4'
});
//高德的安全密钥
window._AMapSecurityConfig = {
	securityJsCode:'98c6989c8633377c2663fe1d4ed7fb34',
}
