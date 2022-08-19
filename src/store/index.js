import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		token:"",
		campu:0,  //校区：0新、1老
		showCard:0,
	},
	mutations: {
	},
	actions: {
	},
	modules: {
	}
})
