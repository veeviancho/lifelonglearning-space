import axios from 'axios';

const state = {
    workshop: [],
    pastWorkshop: [],
    workshopItem: {},
    userWorkshop: [],
    pastUserWorkshop: [],
    popularWorkshop: {},

    workshopStatus: {
        register: '',
        deregister: '',
        create: '',
        update: '',
        delete: ''
    },

    workshopError: {
        register: [],
        deregister: '',
        create: '',
        update: '',
        delete: ''
    }
}

const getters = { 
    workshop: state => state.workshop,
    pastWorkshop: state => state.pastWorkshop,
    workshopItem: state => state.workshopItem,
    userWorkshop: state => state.userWorkshop,
    pastUserWorkshop: state => state.pastUserWorkshop,
    popularWorkshop: state => state.popularWorkshop,
    workshopStatus: state => state.workshopStatus,
    workshopError: state => state.workshopError
}

const actions = {
    // Get current workshops
    async getWorkshop({ commit }) {
        try {
            let res = await axios.get('http://localhost:5000/api/workshops/all');
            if (res.data.success) {
                let workshops = res.data.workshop

                // get current workshops
                let today = new Date()
                const currentWorkshops = workshops.filter(item => {
                    let workshopDate = Date.parse(String(item.date) + "T" + String(item.endTime) + ":00")
                    return workshopDate >= today.getTime()
                })

                // get past workshops
                const pastWorkshops = workshops.filter(item => {
                    let workshopDate = Date.parse(String(item.date) + "T" + String(item.endTime) + ":00")
                    return workshopDate < today.getTime()
                })
                
                // calculate ranking for current workshops
                let ranking = 1
                currentWorkshops.sort( (a,b) => {
                    return b.points - a.points
                })
                
                for (let i=0; i<currentWorkshops.length; i++) {
                    if ((i>0) && (currentWorkshops[i].points < currentWorkshops[i-1].points)) {
                        ranking++
                    }
                    currentWorkshops[i].rank = ranking
                }
                commit('getWorkshops_success', currentWorkshops);
                commit('getPastWorkshops_success', pastWorkshops);
                commit('popularWorkshop_success', currentWorkshops[0]);
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

    // Get past workshop from ID
    async getPastWorkshopFromId({ commit }, id) {
        const workshopId = state.pastWorkshop.find(item => item._id === id)
        commit('workshopID_success', workshopId)
    },

    // Get workshops associated with user
    async getUserWorkshop({ commit }, userId) {
        // Current workshop
        const userWorkshop = state.workshop.filter(item => item.users.includes(userId))
        // Past workshop
        const pastUserWorkshop = state.pastWorkshop.filter(item => item.users.includes(userId))
        // console.log(pastUserWorkshop)
        commit('userWorkshop_success', [userWorkshop, pastUserWorkshop])
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
                commit('deregister_success');
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
    },

    // Update Workshop
    async updateWorkshop({ commit }, workshop) {
        try {
            commit('update_request')
            let res = await axios.put('http://localhost:5000/api/workshops/update', workshop)
            if (res.data.success) {
                commit('update_success')
            }
            return res
        }
        catch (err) {
            commit('update_error', err)
        }
    },

    // Delete Workshop
    async deleteWorkshop({ commit }, id) {
        try {
            commit('delete_request')
            let res = await axios.delete("http://localhost:5000/api/workshops/delete/" + id)
            if (res.data.success) {
                commit('delete_success')
            }
            return res
        }
        catch (err) {
            commit('delete_error', err)
        }
    },

    // Remove feedback
    async removeFeedback({ commit }, [workshopId, userId]) {
        try {
            let res = await axios.put("http://localhost:5000/api/workshops/feedback/remove/" + workshopId + "/" + userId)
            if (res.data.success) {
                commit('update_success')
            }
            return res
        }
        catch (err) {
            console.log(err)
        }
    }
}

const mutations = { 
    // Get workshops
    getWorkshops_success(state, workshop) {
        state.workshop = workshop
    },

    // Get past workshops
    getPastWorkshops_success(state, workshop) {
        state.pastWorkshop = workshop
    },

    // Get one workshop from ID
    workshopID_success(state, workshop) {
        state.workshopItem = workshop
    },

    // Get workshops for user
    userWorkshop_success(state, [workshop, pastWorkshop]) {
        state.userWorkshop = workshop
        state.pastUserWorkshop = pastWorkshop
    },

    // Get popular workshop
    popularWorkshop_success(state, workshop) {
        state.popularWorkshop = workshop
    },

    // Register user to workshop
    workshop_request(state) {
        state.workshopStatus.register = 'loading'
        state.workshopError.register = ''
    },
    workshop_success(state, workshop) {
        state.workshopStatus.register = 'success'
        state.workshopError.register = ''
        state.workshop = workshop
    },
    workshop_error(state, [id, err]) {
        state.workshopStatus.register = 'error'
        state.workshopError.register= [id, err.response.data.msg]
    },

    // Deregister user from workshop
    deregister_request(state) {
        state.workshopStatus.deregister = 'loading'
        state.workshopError.deregister = ''
    },
    deregister_success(state) {
        state.workshopStatus.deregister = 'success'
        state.workshopError.deregister = ''
    },
    deregister_error(state, [id, err]) {
        state.workshopStatus.deregister = 'error'
        state.workshopError.deregister = [id, err.response.data.msg]
    },

    // Create new workshop
    create_request(state) {
        state.workshopStatus.create = 'loading'
        state.workshopError.create = ''
    },
    create_success(state) {
        state.workshopStatus.create = 'success'
        state.workshopError.create = ''
    },
    create_error(state, err) {
        state.workshopStatus.create = 'error'
        state.workshopError.create = err.response.data.msg
    },

    // Update workshop
    update_request(state) {
        state.workshopStatus.update = 'loading'
        state.workshopError.update = ''
    },
    update_success(state) {
        state.workshopStatus.update = 'success'
        state.workshopError.update = ''
    },
    update_error(state, err) {
        state.workshopStatus.update = 'error'
        state.workshopError.update = err.response.data.msg
    },

    // Delete workshop
    delete_request(state) {
        state.workshopStatus.delete = 'loading'
        state.workshopError.delete = ''
    },
    delete_success(state) {
        state.workshopStatus.delete = 'success'
        state.workshopError.delete = ''
    },
    delete_error(state, err) {
        state.workshopStatus.delete = 'error'
        state.workshopError.delete = err.response.data.msg
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}