<template>
	<div class="main">
        <img id="logo" src="../assets/Loading/twtLogo.gif">
        <img id="duck" src="../assets/Loading/duck.gif">
	</div>
</template>

<script>


	export default {
		name: 'Loading',
		components: {
		},
		data() {
			return {
			}
		},
		methods: {
		}
	}
</script>
<style scoped>
    .main{
        height: 100vh;
        width: 100vw;
        background-image: url(../assets/Loading/background.png);
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    #logo{
        margin-top: 13vh;
        width: 70vw;

    }
    #duck{
        margin-top: 7vh;
        width: 35vw;
    }

</style>