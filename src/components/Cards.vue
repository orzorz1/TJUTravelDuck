<template>
	<div class="main">
        <div class="Cards" v-for="(card,index) in newCards" v-if="card.show">
            <img class="card" :src="card.url"/>
            <div class="closeCard" @click="closeCard(0,index)"></div>
        </div>
        <div class="Cards" v-for="(card,index) in oldCards" v-if="card.show">
            <img class="card" :src="card.url"/>
            <div class="closeCard" @click="closeCard(1,index)"></div>
        </div>
	</div>
</template>

<script>


	export default {
		name: 'Cards',
		components: {
		},
		data() {
			return {
                newCards:[
                        {"name":"1895行政楼","show":false,"url":require("../assets/cards/newCard.png")},
                        {"name":"32教","show":false,"url":require("../assets/cards/newCard.png")},
                        {"name":"三问桥","show":false,"url":require("../assets/cards/newCard.png")},
                        {"name":"青年湖","show":false,"url":require("../assets/cards/newCard.png")},
                        {"name":"郑东图书馆","show":false,"url":require("../assets/cards/newCard.png")},
                        {"name":"实事求是石","show":false,"url":require("../assets/cards/newCard.png")},
                        {"name":"大通学生中心","show":false,"url":require("../assets/cards/newCard.png")},
                        {"name":"天外天工作室","show":false,"url":require("../assets/cards/newCard.png")},],
                oldCards:[
                        {"name":"冯骥才艺术研究院","show":false,"url":require("../assets/cards/oldCard.png")},
                        {"name":"北洋大学堂纪念亭","show":false,"url":require("../assets/cards/oldCard.png")},
                        {"name":"友谊湖","show":true,"url":require("../assets/cards/oldCard.png")},
                        {"name":"敬业湖","show":false,"url":require("../assets/cards/oldCard.png")},
                        {"name":"爱晚湖","show":false,"url":require("../assets/cards/oldCard.png")},
                        {"name":"青年湖","show":false,"url":require("../assets/cards/oldCard.png")},
                        {"name":"大学生活动中心","show":false,"url":require("../assets/cards/oldCard.png")},
                        {"name":"第九教学楼","show":false,"url":require("../assets/cards/oldCard.png")},
                        {"name":"天外天工作室","show":false,"url":require("../assets/cards/oldCard.png")},],
			}
		},
		methods: {
            closeCard(campu,index){
                if(!campu){
                    this.newCards[index].show = false
                }
                else{
                    this.oldCards[index].show = false

                }
            }
		}
	}
</script>
<style scoped>
    .Cards{
        position: absolute;
        top: 10vh;
        height: 80vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100vw;
    }
    .card{
        width: 80vw;
    }
    .closeCard{
        background-image: url("../assets/cards/closeCard.png");
        background-size: contain;
        background-repeat: no-repeat;
        width: 8vh;
        height: 8vh;
    }

</style>