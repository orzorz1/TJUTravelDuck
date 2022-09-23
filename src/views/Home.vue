<template>
	<div class="home">
		<!-- 加载界面 -->
		<transition name="fade" mode="out-in">
			<Loading class="loading" v-if="loading" />
		</transition>
		<!-- 说明 -->
		<transition name="fade" mode="out-in">
			<Instruction class="instructionPage" v-if="showInstruct" />
		</transition>
		<!-- 校园地图组件 -->
		<transition name="fade" mode="out-in">
			<div class="map" v-if="!loading">
				<transition name="fade" mode="out-in">
					<MapNew v-if="!campu" ref="MapNew" />
					<MapOld v-if="campu" ref="MapOld" />
				</transition>
			</div>
		</transition>
		<!-- 定位中弹窗 -->
		<transition name="fade" mode="out-in">
			<div class="positioning" v-if="positioning">
			<img src="../assets/positioning/positioning.gif">
			</div>
		</transition>
		<!-- 定位失败弹窗 -->
		<transition name="fade" mode="out-in">
			<div class="positionError" v-if="positionError">
				<div class="closeBtn" @click="closeError"></div>
			</div>
		</transition>
		<!-- 说明按钮 -->
		<transition name="fade" mode="out-in">
			<div class="instruction" v-if="!loading" @click="showInstruction"></div>
		</transition>
		<!-- 定位按钮 -->
		<transition name="fade" mode="out-in">
			<div class="location" @click="getLocation" v-if="!loading"></div>
		</transition>
		<!-- 切换校区按钮 -->
		<transition name="fade" mode="out-in">
			<div class="exchangeCampu" @click="exchangeCampu" v-if="!loading">
				<div class="campuButton1">{{campu==1?'卫津路':'北洋园'}}</div>
				<div class="campuButton2">{{campu==0?'卫津路':'北洋园'}}</div>
			</div>
		</transition>
		<!-- 选择校区弹窗 -->
		<transition name="fade" mode="out-in">
			<div class="selectCampu" v-if="showSelect">
				<img src="../assets/select/Old.png" class="btnOld" @click="select(1)">
				<img src="../assets/select/New.png" class="btnNew" @click="select(0)">
			</div>
		</transition>
	</div>
</template>

<script>
	import MapNew from '@/components/MapNew.vue'
	import MapOld from '@/components/MapOld.vue'
	import Cards from '@/components/Cards.vue'
	import Loading from '@/components/Loading.vue'
	import Instruction from '@/components/Instruction.vue'
	import { mapState, mapGetters } from 'vuex';

	export default {
		name: 'Home',
		components: {
			MapNew,
			MapOld,
			Cards,
			Loading,
			Instruction
		},
		computed: {
			...mapState(['disableButton','disableBtn','ableBtn','token']),
		},
		data() {
			return {
				campu: 0, //校区：0新、1老
				longit: '', // 经度
				latit: '',  // 纬度
				loading: true,
				positioning: false,
				positionError: false,
				showInstruct: false,
				showSelect: false,
				positionNew:[
							{"name":"1895行政楼和实事求是石", "position":[38.998418, 39.000936, 117.319325, 117.321283], "index":0},
							{"name":"斗兽场", "position":[38.9968378, 38.997976, 117.3208753, 117.32235], "index":1},
							{"name":"三问桥", "position":[38.9971047, 38.997555, 117.319115, 117.31993], "index":2},
							{"name":"青年湖", "position":[38.9954156, 38.9991765, 117.3070682, 117.31048], "index":3},
							{"name":"郑东图书馆", "position":[38.996375, 38.998226, 117.31314, 117.315115], "index":4},
							{"name":"大通学生中心", "position":[38.9954156, 38.998026, 117.31048, 117.3118532], "index":5},],
				positionOld:[{"name":"冯骥才艺术研究院", "position":[39.111284, 39.112, 117.1745786, 117.175453], "index":0},
							{"name":"大学生活动中心", "position":[39.1119, 39.1126, 117.17085, 117.17187], "index":3},
							{"name":"北洋纪念亭", "position":[39.1077923, 39.10846, 117.175438, 117.176103], "index":1},
							{"name":"友谊湖", "position":[39.10609, 39.10828, 117.168164, 117.169827], "index":2},
							{"name":"敬业湖", "position":[39.1077, 39.108675, 117.1702677, 117.1743], "index":2},
							{"name":"爱晚湖", "position":[39.10828, 39.109728, 117.168164, 117.16986], "index":2},
							{"name":"青年湖", "position":[39.11082, 39.11305, 117.1707, 117.1745786], "index":2},
							{"name":"第九教学楼", "position":[39.1087541, 39.10952, 117.174337, 117.17543134], "index":4}],
			}
		},
		beforeCreate(){

		},
		beforeMount() {
			this.preload()
			this.$store.commit('disableBtn')
			let that = this
			let timerRun = 0
			let timer = setInterval(function(){
				let token = that.$route.query.token
				that.$store.commit('setToken0', token)
				var xhr = new XMLHttpRequest();
				xhr.open('POST','http://101.42.135.145:8081/api/v1/auth/client');
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
				xhr.send("token="+token);
				xhr.onloadend = function(e){
					if(e.target.status===200){
						clearInterval(timer)
					}
					var json = JSON.parse(e.target.response)
					that.$store.commit('setToken', json.result)
					if(json.message==='曾经登录过'){
						var xhr = new XMLHttpRequest();
						xhr.open('GET','http://101.42.135.145:8081/api/v1/school?token='+that.token);
						xhr.send(null);
						xhr.onloadend = function(e){
							that.$store.commit('ableBtn')
							if(e.target.status===200){
								var json = JSON.parse(e.target.response)
								console.log(json)
								if(json.result === "卫津路校区"){
									that.campu = 1
									that.$store.commit('setCampu', 1)
								}else{
									that.campu = 0
									that.$store.commit('setCampu', 0)
								}
							}
						}
					}else{
						setTimeout(()=>{
							that.showInstruct = true
							setTimeout(()=>{that.showSelect = true},500)
						},800)
					}
				}
				timerRun++
				if(timerRun>=5){
					clearInterval(timer)
				}
			},200)

		},

		methods: {
			preload() {
				let count = 0;
				let imgs = [
					//用require的方式添加图片地址，直接添加图片地址的话，在build打包之后会查找不到图片，因为打包之后的图片名称会有一个加密的字符串
					require('../assets/map/old.png'),
					require('../assets/map/new.png'),
					require('../assets/cards/4lake.png'),
					require('../assets/cards/9.png'),
					require('../assets/cards/32.png'),
					require('../assets/cards/1895.png'),
					require('../assets/cards/bridge.png'),
					require('../assets/cards/dahuo.png'),
					require('../assets/cards/datong.png'),
					require('../assets/cards/jicaiFeng.png'),
					require('../assets/cards/lake.png'),
					require('../assets/cards/library.png'),
					require('../assets/cards/ting.png')
				]
				for (let img of imgs) {
					let image = new Image();
					image.src = img;
					image.onload = () => {
						count++;
						if (count == 2) {
							setTimeout(()=>{
								this.loading = false
							}, 1000)
						}
					};
				}
			},
			getLocation() {
				if(!this.disableButton){
					this.$store.commit('disableBtn')
					this.positioning = true
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
							setTimeout(()=>{
								// data是具体的定位信息
								that.longit = data.position.lng
								that.latit = data.position.lat
								// alert(data.accuracy)
								that.checkPosition(that.latit, that.longit)
								that.positioning = false
								this.$store.commit('ableBtn')
							},500)
						}
						function onError(data) {
							// 定位出错
							setTimeout(()=>{
								console.log('定位失败')
								that.positioning = false
								that.positionError = true
							},500)
						}
					})
					that.maps = map
				}
			},
			checkPosition(lat, lng){
				let flag = 0
				if(!this.campu){
					for(let i=0; i<this.positionNew.length; i++){
						if(lat > this.positionNew[i].position[0] && lat < this.positionNew[i].position[1] && lng > this.positionNew[i].position[2] && lng < this.positionNew[i].position[3]){
							alert(this.positionNew[i].name)
							flag = 1
							break
						}
					}
				}else{
					for(let i=0; i<this.positionOld.length; i++){
						if(lat > this.positionOld[i].position[0] && lat < this.positionOld[i].position[1] && lng > this.positionOld[i].position[2] && lng < this.positionOld[i].position[3]){
							alert(this.positionOld[i].name)
							flag = 1
							break
						}
					}
				}
				if(flag == 0){
					this.positionError = true
				}
			},
			closeError(){
				this.$store.commit('ableBtn')
				this.positionError = false
			},
			exchangeCampu(){
				if(!this.disableButton){
					if(this.campu==0){
						this.campu=1
					}else{
						this.campu=0
					}
				}
			},
			showInstruction(){
				if(!this.disableButton){
					this.showInstruct = true
				}
			},
			closeInstruction(){
				this.showInstruct = false
			},
			select(c){
				this.showSelect = false
				this.campu = c
				this.$store.commit('setCampu', c)
				this.$store.commit('ableBtn')
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
	.instructionPage{
		z-index: 10000;
		position: absolute;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
	}

	.map {
		z-index: -1;
		position: absolute;
		overflow: hidden;
		margin: 0;
		width: 100vw;
		height: 100vh;
	}
	.positioning{
		background-image: url('../assets/positioning/background.png');
		background-size: contain;
        background-repeat: no-repeat;
		position: absolute;
		top: 20vh;
		margin-left: 10vw;
		width: 80vw;
		height: 100vh;
	}
	.positioning img{
		margin-top: 9vh;
		width: 50vw;
	}
	.positionError{
		width: 70vw;
		height: 110vw;
		position: absolute;
		left: 15vw;
		top: 20vh;
		background-image: url("../assets/positioning/error.png");
        background-size: contain;
        background-repeat: no-repeat;
	}
	.positionError .closeBtn{
		background-color: aqua;
		position: absolute;
		width: 10vw;
		height: 10vw;
		left: 57vw;
		top: 1.5vh;
		border-radius: 5vw;	
	}
	.showCards {
		z-index: 10;
		position: absolute;
	}

	.instruction {
		background-color: white;
		background-image: url("../assets/icon/instruction.png");
		opacity: 0.9 ;
		background-size: cover;
		border-radius: 100px;
		display: block;
		position: fixed;
		height: 30px;
		width: 30px;
		top: 4vw;
		right: 4vw;
	}

	.location {
		background-color: white;
		background-image: url("../assets/icon/location.png");
		opacity: 0.9 ;
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
		opacity: 0.9 ;
		top: 15vw;
		right: 4vw;
		width: 30px;
		height: 120px;
		border-radius: 100px;
		
	}
	.campuButton1{
		position: relative;
		background-color: white;
		border-radius: 100px;
		writing-mode:tb;
		text-align: center;
		line-height: 30px;
		font-size: 18px;
		z-index: 2;
		top: 0;
		left: 0;
		width: 30px;
		height: 85px;
	}
	.campuButton2{
		position: relative;
		background-color: #E9EAE4;
		border-radius: 100px;
		writing-mode:tb;
		text-align: center;
		line-height: 30px;
		font-size: 18px;
		z-index: 1;
		top: -55px;
		left: 0;
		width: 30px;
		height: 85px;
	}
	.selectCampu{
		background-image: url("../assets/select/Background.png");
        background-size: 100% auto;
        background-repeat: no-repeat;
		width: 60vw;
		left: 20vw;
		height: 80vh;
		position:absolute;
		top: 25vh;
	}
	.btnNew{
		position: absolute;
		z-index: 1000;
		width: 60vw;
		height: auto;
		left: 0;
		top: 22vh
	}
	.btnOld{
		position: absolute;
		z-index: 1000;
		width: 60vw;
		height: auto;
		left: 0;
		top: 12vh
	}
</style>