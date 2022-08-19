<template>
	<div class="home">
		<!-- 加载界面 -->
		<transition name="fade" mode="out-in">
			<Loading class="loading" v-if="loading" />
		</transition>
		<!-- 校园地图组件 -->
		<transition name="fade" mode="out-in">
			<div class="map" v-if="!loading">
				<transition name="fade" mode="out-in">
					<MapNew v-if="!campu" />
					<MapOld v-if="campu" />
				</transition>
			</div>
		</transition>
		<!-- 文化卡片组件 -->
		<transition name="fade" mode="out-in">
			<Cards class="showCards" ref="showCards" v-if="!loading" />
		</transition>
		<!-- 说明按钮 -->
		<transition name="fade" mode="out-in">
			<div class="instruction" v-if="!loading"></div>
		</transition>
		<!-- 定位按钮 -->
		<transition name="fade" mode="out-in">
			<div class="location" @click="getLocation1" v-if="!loading"></div>
		</transition>
		<!-- 切换校区按钮 -->
		<transition name="fade" mode="out-in">
			<div class="exchangeCampu" @click="exchangeCampu" v-if="!loading">
				<div class="campuButton1">{{campu==1?'卫津路':'北洋园'}}</div>
				<div class="campuButton2">{{campu==0?'卫津路':'北洋园'}}</div>
			</div>
		</transition>
	</div>
</template>

<script>
	// @ is an alias to /src
	import MapNew from '@/components/MapNew.vue'
	import MapOld from '@/components/MapOld.vue'
	import Cards from '@/components/Cards.vue'
	import Loading from '@/components/Loading.vue'

	export default {
		name: 'Home',
		components: {
			MapNew,
			MapOld,
			Cards,
			Loading
		},
		data() {
			return {
				campu: 0, //校区：0新、1老
				longit: '', // 经度
				latit: '',  // 纬度
				loading: true,
			}
		},
		beforeMount() {
			this.preload()
		},
		methods: {
			preload() {
				let count = 0;
				let imgs = [
					//用require的方式添加图片地址，直接添加图片地址的话，在build打包之后会查找不到图片，因为打包之后的图片名称会有一个加密的字符串
					require('../assets/map/old.png'),
					require('../assets/map/new.png'),
				]
				for (let img of imgs) {
					let image = new Image();
					image.src = img;
					image.onload = () => {
						count++;
						if (count == 2) {
							this.loading = false
						}
					};
				}
			},
			getLocation1() {
				// 先定义that = this   
				var that = this

				// 生成地图
				var map = new window.AMap.Map('container', {
					resizeEnable: true,
					zoom: 11,
					showIndoorMap: false, // 是否在有矢量底图的时候自动展示室内地图，PC默认true,移动端默认false
					dragEnable: true, // 地图是否可通过鼠标拖拽平移，默认为true
					keyboardEnable: false, // 地图是否可通过键盘控制，默认为true
					doubleClickZoom: true, // 地图是否可通过双击鼠标放大地图，默认为true
					zoomEnable: true, // 地图是否可缩放，默认值为true
					rotateEnable: false, // 地图是否可旋转，3D视图默认为true，2D视图默认false
					viewMode: '3D'
				})


				// 获取到当前位置的定位
				AMap.plugin('AMap.Geolocation', function () {
					var geolocation = new AMap.Geolocation({
						// 是否使用高精度定位，默认：true
						enableHighAccuracy: true,
						// 设置定位超时时间，默认：无穷大
						timeout: 10000,
						// 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
						buttonOffset: new AMap.Pixel(10, 20),
						//  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
						zoomToAccuracy: true,
						//  定位按钮的排放位置,  RB表示右下
						buttonPosition: 'RB'
					})

					geolocation.getCurrentPosition()
					AMap.event.addListener(geolocation, 'complete', onComplete)
					AMap.event.addListener(geolocation, 'error', onError)

					function onComplete(data) {
						// data是具体的定位信息
						console.log(data)
						that.longit = data.position.lng
						that.latit = data.position.lat
						// alert(data.accuracy)
						alert(that.longit + "  " + that.latit)
					}
					function onError(data) {
						// 定位出错
						console.log('定位失败')
					}
				})
				that.maps = map
			},
			exchangeCampu(){
				if(this.campu==0){
					this.campu=1
				}else{
					this.campu=0
				}
			}
		}
	}
</script>
<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: all 0.5s ease
	}

	.fade-enter,
	.fade-leave-active {
		opacity: 0
	}

	.home {
		overflow: hidden;
	}

	.loading {
		position: absolute;
		width: 100vw;
		height: 100vh;
		z-index: 100;
	}

	.map {
		z-index: -1;
		position: absolute;
		overflow: hidden;
		width: 100vw;
		height: 100vh;
	}

	.showCards {
		z-index: 10;
		position: absolute;
	}

	.instruction {
		background-color: white;
		background-image: url("../assets/icon/instruction.png");
		background-size: cover;
		border-radius: 100px;
		display: block;
		position: fixed;
		height: 35px;
		width: 35px;
		top: 8vw;
		right: 8vw;
	}

	.location {
		background-color: white;
		background-image: url("../assets/icon/location.png");
		background-size: cover;
		border-radius: 100px;
		display: block;
		position: fixed;
		height: 15vw;
		width: 15vw;
		bottom: 8vw;
		left: 42.5vw;
	}
	.exchangeCampu{
		position: fixed;
		top: 25vw;
		right: 8vw;
		width: 35px;
		height: 120px;
		border-radius: 100px;
		
	}
	.campuButton1{
		position: relative;
		background-color: white;
		border-radius: 100px;
		writing-mode:tb;
		text-align: center;
		line-height: 35px;
		font-size: 18px;
		z-index: 2;
		top: 0;
		left: 0;
		width: 35px;
		height: 85px;
	}
	.campuButton2{
		position: relative;
		background-color: white;
		border-radius: 100px;
		writing-mode:tb;
		text-align: center;
		line-height: 35px;
		font-size: 18px;
		z-index: 1;
		top: -50px;
		left: 0;
		width: 35px;
		height: 85px;
	}
</style>