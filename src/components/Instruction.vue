<template>
    <div class="main" @click="show">
        <transition name="Left">
            <img class="instruction1" src="../assets/Instruction/1.png" v-if="showPic >= 1">
        </transition>
        <transition name="Right">
        <img class="instruction2" src="../assets/Instruction/2.png" v-if="showPic >= 2">
        </transition>
        <transition name="Left">
        <img class="instruction3" src="../assets/Instruction/3.png" v-if="showPic >= 3">
        </transition>
        <transition name="Left">
        <img class="instruction4" src="../assets/Instruction/4.png" v-if="showPic >= 4">
        </transition>
        <transition name="Right">
        <img class="instruction5" src="../assets/Instruction/5.png" v-if="showPic >= 5">
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'Cards',
        data() {
            return {
                showPic:0,
                otimer:null
            }
        },
        mounted(){
            this.show()
            this.otimer = setInterval(()=>{
                this.show()
                if(this.showPic >= 5){
                    clearInterval(this.otimer);
                }
            },2000)
        },
        methods: {
            show(){
                console.log(this.showPic)
                this.showPic++
                if(this.showPic > 5){
                    this.$parent.closeInstruction()
                    clearInterval(this.otimer);
                }
            }
        }
    }
</script>
<style scoped>
    .main {
        background-color: white;
        width: 100vw;
        height: 100vh;
    }
    .main img{
        position: absolute;
        top: 0;
        left: 0vw;
        width: 100vw;
        pointer-events: none;
    }

    @keyframes leftR {
        0% {
            left: -100vw;
        }

        100% {
            left: 0;
        }
    }

    @keyframes RightL {
        0% {
            left: 100vw;
        }

        100% {
            left: 0;
        }
    }
    
    .Left-enter-active{
        transform-origin: left center;
        animation: leftR 1s;
    }
    .Right-enter-active{
        transform-origin: left center;
        animation: RightL 1s;
    }
</style>