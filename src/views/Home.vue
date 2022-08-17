<template>
	<div class="home">
		<div class="map">
			<MapNew v-if="!campu" />
			<MapOld v-if="campu" />
		</div>
		<div class="instruction"></div>
		<div class="location" @click="getLocation1"></div>
	</div>
</template>

<script>
	// @ is an alias to /src
	import MapNew from '@/components/MapNew.vue'
	import MapOld from '@/components/MapOld.vue'

	export default {
		name: 'Home',
		components: {
			MapNew,
			MapOld,
			MapOld
		},
		data() {
			return {
				campu: 0, //校区：0新、1老
				longit: '', // 经度
				latit: '',  // 纬度
			}
		},
		methods: {
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
		}
	}
</script>
<style scoped>
	.home {
		overflow: hidden;
	}

	.map {
		z-index: -1;
		position: absolute;
		overflow: hidden;
		width: 100vw;
		height: 100vh;
	}

	.instruction {
		background-color: white;
		background-image: url("../assets/icon/instruction.png");
		background-size: cover;
		border-radius: 100px;
		display: block;
		position: fixed;
		height: 8vw;
		width: 8vw;
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
</style>