import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		token0: '',
		token: '',
		campu: -1,  //校区：0新、1老
		disableButton: false,
		apiUrl: "http://101.43.148.116:8081"
	},
	mutations: {
		disableBtn() {
			this.state.disableButton = true
		},
		ableBtn() {
			this.state.disableButton = false
		},
		setToken0(state, obj) {
			this.state.token0 = obj;
		},
		setToken(state, obj) {
			this.state.token = obj;
		},
		setCampu(state, obj) {
			this.state.campu = obj;
		},
	},
	actions: {
	},
	modules: {
	}
})
