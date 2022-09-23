<template>
    <div class="main">
        <!-- 新校区文化卡片 -->
        <div class="Cards" v-for="(card,index) in newCards" v-if="newCardState[index]">
            <img class="card" :src="card.url" />
            <div class="closeCard" @click="closeCard(0,index)"></div>
        </div>
        <!-- 老校区文化卡片 -->
        <div class="Cards" v-for="(card,index) in oldCards" v-if="oldCardState[index]">
            <img class="card" :src="card.url" />
            <div class="closeCard" @click="closeCard(1,index)"></div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    export default {
        name: 'Cards',
		computed: {
            ...mapState(['newCardState','oldCardState','opneNewCard','openOldCard','closeNewCard','closeOldCard']),
		},
        data() {
            return {
                newCards: [
                    { "name": "1895行政楼和实事求是石", "show": false, "url": require("../assets/cards/newCard.png") },
                    { "name": "32教", "show": false, "url": require("../assets/cards/newCard.png") },
                    { "name": "三问桥", "show": false, "url": require("../assets/cards/newCard.png") },
                    { "name": "青年湖", "show": false, "url": require("../assets/cards/newCard.png") },
                    { "name": "郑东图书馆", "show": false, "url": require("../assets/cards/newCard.png") },
                    { "name": "实事求是石", "show": false, "url": require("../assets/cards/newCard.png") },
                    { "name": "大通学生中心", "show": false, "url": require("../assets/cards/newCard.png") },],
                oldCards: [
                    { "name": "冯骥才艺术研究院", "show": false, "url": require("../assets/cards/oldCard.png") },
                    { "name": "北洋大学堂纪念亭", "show": false, "url": require("../assets/cards/oldCard.png") },
                    { "name": "四大湖", "show": true, "url": require("../assets/cards/oldCard.png") },
                    { "name": "大学生活动中心", "show": false, "url": require("../assets/cards/oldCard.png") },
                    { "name": "第九教学楼", "show": false, "url": require("../assets/cards/oldCard.png") },],
            }
        },
        methods: {
            closeCard(campu, index) {
                if(!campu){
                    this.$store.commit('closeC', campu, index)
                }else{

                }
            }
        }
    }
</script>
<style scoped>
    .Cards {
        position: absolute;
        top: 10vh;
        height: 80vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100vw;
    }

    .card {
        width: 80vw;
    }

    .closeCard {
        background-image: url("../assets/cards/closeCard.png");
        background-size: contain;
        background-repeat: no-repeat;
        width: 8vh;
        height: 8vh;
    }
</style>