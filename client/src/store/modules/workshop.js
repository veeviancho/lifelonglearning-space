import axios from 'axios';

const state = {
    workshop_status: '',
    workshop: [],
    workshop_error: [],
    workshopItem: {},

    userWorkshop: [],

    deregister_status: '',
    deregister_error: [],

    create_status: '',
    create_error: ''
}

const getters = {
    workshop_status: state => state.workshop_status,
    workshop: state => state.workshop,
    workshopItem: (state) => state.workshopItem,
    workshop_error: state => state.workshop_error,

    userWorkshop: state => state.userWorkshop,

    deregister_status: state => state.deregister_status,
    deregister_error: state => state.deregister_error,

    create_status: state => state.create_status,
    create_error: state => state.create_error
}

const actions = {
    // Get workshops
    async getWorkshop({ commit }) {
        try {
            let res = await axios.get('http://localhost:5000/api/workshops/all');
            if (res.data.success) {
                commit('getWorkshop_success', res.data.workshop);
            }
        } catch (err) {
            console.log(err)
        }
    },

    // Get workshop from ID
    async getWorkshopFromId({ commit }, id) {
        const workshopId = state.workshop.find(item => item._id === id)
        commit('workshopID_success', workshopId)
    },

    // Get workshops associated with user
    async getUserWorkshop({ commit }, userId) {
        const userWorkshop = state.workshop.filter(item => item.users.includes(userId))
        commit('userWorkshop_success', userWorkshop)
    },

    // Register User to Workshop (update workshop and user)
    async registerForWorkshop({ commit }, [workshopId, userId] ) {
        try {
            commit('workshop_request');
            let res = await axios.put('http://localhost:5000/api/workshops/register/' + workshopId + '/' + userId);
            if (res.data.success) {
                commit('workshop_success', res.data.workshop);
            }
            return res;
        } catch (err) {
            commit('workshop_error', [workshopId, err])
        }
    },

    // Deregister User from Workshop (update workshop and user)
    async deregisterFromWorkshop({ commit }, [workshopId, userId]) {
        try {
            commit('deregister_request');
            let res = await axios.put('http://localhost:5000/api/workshops/deregister/' + workshopId + '/' + userId);
            if (res.data.success) {
                commit('deregister_success', res.data.workshop);
            }
            return res;
        } catch (err) {
            commit('deregister_error', [workshopId, err])
        }
    },

    // Create Workshop
    async createWorkshop({ commit }, workshop) {
        try {
            commit('create_request')
            let res = await axios.post('http://localhost:5000/api/workshops/create', workshop)
            if (res.data.success) {
                commit('create_success')
            }
            return res
        }
        catch (err) {
            commit('create_error', err)
        }
    }

}

const mutations = {

    // Get one workshop
    workshopID_success(state, workshop) {
        state.workshopItem = workshop
    },

    // Get workshops
    getWorkshop_success(state, workshop) {
        state.workshop = workshop
    },

    // Get workshop for user
    userWorkshop_success(state, workshop) {
        state.userWorkshop = workshop
    },

    // Register user to workshop
    workshop_request(state) {
        state.workshop_status = 'loading'
        state.workshop_error = ''
    },
    workshop_success(state, workshop) {
        state.workshop_status = 'success'
        state.workshop_error = ''
        state.workshop = workshop
    },
    workshop_error(state, [id, err]) {
        state.workshop_status = 'error'
        state.workshop_error = [id, err.response.data.msg]
    },

    // Deregister user from workshop
    deregister_request(state) {
        state.deregister_status = 'loading'
        state.deregister_error = ''
    },
    deregister_success(state, workshop) {
        state.deregister_status = 'success'
        state.deregister_error = ''
        state.deregister = workshop
    },
    deregister_error(state, [id, err]) {
        state.deregister_status = 'error'
        state.deregister_error = [id, err.response.data.msg]
    },

    // Create new workshop
    create_request(state) {
        state.create_status = 'loading'
        state.create_error = ''
    },
    create_success(state, workshop) {
        state.create_status = 'success'
        state.create_error = ''
        state.create = workshop
    },
    create_error(state, err) {
        state.create_status = 'error'
        state.create_error = err.response.data.msg
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}