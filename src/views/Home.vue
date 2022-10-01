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
					<MapNew v-if="!nowCampu" ref="MapNew" />
					<MapOld v-if="nowCampu"  ref="MapOld" />
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
		<!-- 集齐卡片弹窗弹窗 -->
		<transition name="fade" mode="out-in">
			<div v-if="got">
				<div class="gotMask" @click="closeGot">
					<div class="got" @click.stop=""></div>
				</div>
			</div>
		</transition>
		<!-- 说明按钮 -->
		<transition name="fade" mode="out-in">
			<div class="instruction" v-if="!loading" @click="showInstruction"></div>
		</transition>
		<!-- 定位按钮,函数已修改，用不了了 -->
		<!-- <transition name="fade" mode="out-in">
			<div class="location" @click="getLocation" v-if="!loading"></div>
		</transition> -->
		<!-- 切换校区按钮 -->
		<transition name="fade" mode="out-in">
			<div class="exchangeCampu" @click="exchangeCampu" v-if="!loading">
				<div class="campuButton1" :style="{'background-color': nowCampu ? '#E9EAE4':'white'}">卫津路</div>
				<div class="campuButton2" :style="{'background-color': !nowCampu ? '#E9EAE4':'white'}">北洋园</div>
			</div>
		</transition>
		<!-- 选择校区弹窗 -->
		<transition name="fade" mode="out-in">
			<div class="selectCampu" v-if="showSelect">
				<img src="../assets/select/Old.png" class="btnOld" @click="select(1)">
				<img src="../assets/select/New.png" class="btnNew" @click="select(0)">
			</div>
		</transition>
		<!-- 说明弹窗 -->
		<transition name="fade" mode="out-in">
			<div class="instruct_back"  v-if="instruct" @click="closeInstrcuk">
				<img class="instruct" v-if="instruct" src="../assets/Instruction/instructions.png"/>
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
			...mapState(['disableButton','disableBtn','ableBtn','token','campu','apiUrl']),
		},
		data() {
			return {
				nowCampu: 0, //校区：0新、1老
				longit: '', // 经度
				latit: '',  // 纬度
				loading: true,
				positioning: false,
				positionError: false,
				showInstruct: false, //首次登录引导
				instruct:false, //说明页
				showSelect: false,
				got: false,
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

		async beforeMount() {
			this.$store.commit('disableBtn')
			await this.preload()
			let that = this
			let timerRun = 0
			let timer = setInterval(function(){
				let token = that.$route.query.token
				that.$store.commit('setToken0', token)
				var xhr = new XMLHttpRequest();
				xhr.open('POST',that.apiUrl+'/api/v1/auth/client');//用户登录
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
						xhr.open('GET',that.apiUrl+'/api/v1/school?token='+that.token);//查询校区
						xhr.send(null);
						xhr.onloadend = function(e){
							that.$store.commit('ableBtn')
							if(e.target.status===200){
								var json = JSON.parse(e.target.response)
								if(json.result === "卫津路校区"){
									that.nowCampu = 1
									that.$store.commit('setCampu', 1)
								}else if(json.result === "北洋园校区"){
									that.nowCampu = 0
									that.$store.commit('setCampu', 0)
								}else{
									that.showSelect = true
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
					setTimeout(()=>{
							that.showInstruct = true
							setTimeout(()=>{that.showSelect = true},500)
						},800)
				}
			},500)		
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
					require('../assets/cards/ting.png'),
					require('../assets/Instruction/1.png'),
					require('../assets/Instruction/2.png'),
					require('../assets/Instruction/3.png'),
					require('../assets/Instruction/4.png'),
					require('../assets/Instruction/5.png'),
					require('../assets/map/new/32.png'),
					require('../assets/map/new/1895.png'),
					require('../assets/map/new/datong.png'),
					require('../assets/map/new/lake.png'),
					require('../assets/map/new/library.png'),
					require('../assets/map/new/ssqs.png'),
					require('../assets/map/new/twt.png'),
					require('../assets/map/old/daHuo.png'),
					require('../assets/map/old/dedicationLake.png'),
					require('../assets/map/old/feng.png'),
					require('../assets/map/old/friendshipLake.png'),
					require('../assets/map/old/loveNightLake.png'),
					require('../assets/map/old/nine.png'),
					require('../assets/map/old/ting.png'),
					require('../assets/map/old/twt.png'),
					require('../assets/map/old/youthLake.png'),
				]
				for (let img of imgs) {
					let image = new Image();
					image.src = img;
					image.onload = () => {
						count++;
						if (count == imgs.length) {
							setTimeout(()=>{
								this.loading = false
							}, 1000)
						}
					};
				}
			},
			getLocation(index) {
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
							that.positioning = false
							that.checkPosition(that.latit, that.longit, index)
							// that.checkPosition(38.9976491, 117.3084621, index)
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
			},
			checkPosition(lat, lng, i){
				this.$store.commit('disableBtn')
				let flag = 0
				let that = this
				if(!this.nowCampu){
					//新校区
					//判断在经纬度范围内
					if(lat > this.positionNew[i].position[0] && lat < this.positionNew[i].position[1] && lng > this.positionNew[i].position[2] && lng < this.positionNew[i].position[3]){
						this.$refs.MapNew.duckState = 1
						this.$refs.MapNew.getedCard[i] = 1
						this.$refs.MapNew.duckMove(i)
						setTimeout(()=>{
							if(!this.got){
								this.$refs.MapNew.newCards[i].show = true
							}else{
								this.$refs.MapNew.newCards[i].show = true
								this.$refs.MapNew.newCards[i].show = false
							}
						},2200)
						//获得卡片请求
						let id = 0
						if(i===0){id=21}
						else if(i===1){id=22}
						else if(i===2){id=23}
						else if(i===3){id=24}
						else if(i===4){id=25}
						else if(i===5){id=26}
						var xhr = new XMLHttpRequest();
						xhr.open('POST',that.apiUrl+'/api/v1/card/user?token='+that.token);
						xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
						xhr.send("cardId="+id);
						xhr.onloadend = function(e){
							if(e.target.status===200){
								var json = JSON.parse(e.target.response)
								let count = 0
								for(let k=0;k<that.$refs.MapNew.getedCard.length;k++){
									if(that.$refs.MapNew.getedCard[k]===1){count++}
								}
								if(that.$refs.MapNew.getedCard.length===count){
									that.$store.commit('disableBtn')
									setTimeout(()=>{that.got = true},2000)
								}
							}
						}
						flag = 1
					}
					
				}else{
					if(lat > this.positionOld[i].position[0] && lat < this.positionOld[i].position[1] && lng > this.positionOld[i].position[2] && lng < this.positionOld[i].position[3]){
						this.$refs.MapOld.duckState = 1
						this.$refs.MapOld.getedCard[i] = 1
						this.$refs.MapOld.duckMove(i)
						setTimeout(()=>{
							if(!this.got){
								this.$refs.MapOld.oldCards[i].show = true
							}else{
								this.$refs.MapOld.oldCards[i].show = true
								this.$refs.MapOld.oldCards[i].show = false
							}
						},2200)
						//获得卡片请求
						let id = 0
						if(i===0){id=11}
						else if(i===1){id=12}
						else if(i===2){id=13}
						else if(i===3){id=14}
						else if(i===4){id=15}
						var xhr = new XMLHttpRequest();
						xhr.open('POST',that.apiUrl+'/api/v1/card/user?token='+that.token);
						xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
						xhr.send("cardId="+id);
						xhr.onloadend = function(e){
							if(e.target.status===200){
								var json = JSON.parse(e.target.response)
								let count = 0
								for(let k=0;k<that.$refs.MapOld.getedCard.length;k++){
									if(that.$refs.MapOld.getedCard[k]===1){count++}
								}
								if(that.$refs.MapOld.getedCard.length===count){
									that.$store.commit('disableBtn')
									setTimeout(()=>{that.got = true},2000)
								}
							}
						}
						flag = 1
					}
					
				}
				if(flag == 0){
					this.positionError = true
				}
			},
			closeGot(){
				this.$store.commit('ableBtn')
				this.got = false
			},
			closeError(){
				this.$store.commit('ableBtn')
				this.positionError = false
			},
			exchangeCampu(){
				if(!this.disableButton){
					if(this.nowCampu===0){
						this.nowCampu=1
					}else{
						this.nowCampu=0
					}
				}
			},
			showInstruction(){
				if(!this.disableButton){
					this.instruct = true
				}
			},
			closeInstruction(){
				this.showInstruct = false
			},
			closeInstrcuk(){
				this.instruct = false
			},
			select(c){
				this.showSelect = false
				this.nowCampu = c
				this.$store.commit('setCampu', c)
				let cam = 0
				if(c===0){
					cam = 2
				}else if(c===1){
					cam = 1
				}
				let that = this
				var xhr = new XMLHttpRequest();
				xhr.open('POST',that.apiUrl+'/api/v1/school?token='+that.token);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
				xhr.send("school="+cam);
				xhr.onloadend = function(e){
					this.$store.commit('ableBtn')
					if(e.target.status===200){
						var json = JSON.parse(e.target.response)
					}
				}
f			}
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
	.gotMask{
		position: absolute;
		z-index: 0;
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.gotMask1{
		position: absolute;
		z-index: 0;
		height: 100vh;
		width: 100vw;

	}
	.got{
		z-index: 1;
		background-image: url('../assets/cards/collected.png');
		background-size: contain;
        background-repeat: no-repeat;
		top: 20vh;
		width: 70vw;
		height: 50vh;
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
		background-image: url("../assets/positioning/close.png");
		background-size: contain;
        background-repeat: no-repeat;
		position: absolute;
		width: 10vw;
		height: 10vw;
		left: 57vw;
		top: 1.6vh;
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
		height: 35px;
		width: 35px;
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
		background-color: white;
		position: fixed;
		display: flex;
		flex-direction: column;
		opacity: 0.9 ;
		top: 15vw;
		right: 4vw;
		width: 35px;
		height: 150px;
		border-radius: 100px;
		
	}
	.campuButton1{
		border-radius: 100px;
		writing-mode:tb;
		text-align: center;
		line-height: 25px;
		font-size: 15px;
		z-index: 2;
		margin-top: 5px;
		margin-left: 5px;
		width: 25px;
		height: 70px;
	}
	.campuButton2{
		border-radius: 100px;
		writing-mode:tb;
		text-align: center;
		line-height: 25px;
		font-size: 15px;
		z-index: 1;
		top: -55px;
		margin-top: 5px;
		margin-left: 5px;
		margin-bottom: 5px;
		width: 25px;
		height: 70px;
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
	.instruct_back{
		background-image: url('../assets/Loading/background.png');
		background-size:100% 100%;
		position: absolute;
		width: 100vw;
		height: 100vh;
	}
	.instruct{
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}
</style>