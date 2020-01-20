import Login from 'src/components/Login.vue'
import Main from 'src/components/Main.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
          requiresVisitor: true,
        }
    },
    {
        path: '/',
        name: 'Main',
        component: Main,
        meta: {
            requiresAuth: true
        }
    },

]

export default routes