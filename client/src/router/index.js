import { createRouter, createWebHistory } from 'vue-router'

// Public views
import Home from '../views/public/Home.vue'
import Articles from '../views/public/Articles.vue'
import ArticleDetails from '../views/public/ArticleDetails.vue'
import About from '../views/public/About.vue'
import Login from '../views/public/auth/Login.vue'
import Register from '../views/public/auth/Register.vue'

// User views
import Workshop from '../views/user/workshop/Workshop.vue'
import Details from '../views/user/workshop/WorkshopDetails.vue'
import History from '../views/user/workshop/Past.vue'
import HistoryDetails from '../views/user/workshop/PastWorkshopDetails.vue'
import Upcoming from '../views/user/workshop/Upcoming.vue'

import Room from '../views/user/booking/Rooms.vue'
import RoomDetails from '../views/user/booking/RoomDetails.vue'
import UserPastBookings from '../views/user/booking/PastBookings.vue'
import UserBookings from '../views/user/booking/UpcomingBookings.vue'

import Activities from '../views/user/activities/RealTime.vue'

import Profile from '../views/user/profile/Profile.vue'
import ProfileReport from '../views/user/profile/ProfileReport.vue'

// Admin views
import AdminHome from '../views/admin/Home.vue'
import AdminAbout from '../views/admin/About.vue'
import AdminArticles from '../views/admin/Articles.vue'
import AdminBooking from '../views/admin/Booking.vue'
import AdminRealTime from '../views/admin/RealTime.vue'
import AdminProfile from '../views/admin/RealTime.vue'

import AdminWorkshop from '../views/admin/Workshop.vue'
import AdminPastWorkshop from '../views/admin/PastWorkshop.vue'
import WorkshopUsers from '../views/admin/WorkshopUsers.vue'
import PastWorkshopUsers from '../views/admin/PastWorkshopUsers.vue'
import AdminUsers from '../views/admin/Users.vue'
import AdminMessages from '../views/admin/Messages.vue'
import AdminWorkshopAttendance from '../views/admin/WorkshopAttendance.vue'

const routes = [
  // Public views
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      public: true
    }
  },
  {
    path: '/articles',
    name: 'Articles',
    component: Articles,
    meta: {
      public: true
    }
  },
  {
    path: '/articles/:id',
    name: 'Article Details',
    component: ArticleDetails,
    props: true,
    meta: {
      public: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      public: true
    }
  },
  // Public views - not accessible when logged in
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      public: true,
      onlyLoggedOut: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      public: true,
      onlyLoggedOut: true
    }
  },

  // User views - not accessible when not logged in
  // Workshops
  {
    path: '/workshop',
    name: 'Workshops',
    component: Workshop
  },
  {
    path: '/workshop/:id',
    name: 'Workshop Details',
    component: Details,
    props: true
  },
  {
    path: '/profile/attended-workshops',
    name: 'Past Workshops',
    component: History
  },
  {
    path: '/profile/attended-workshops/:id',
    name: 'Past Workshop Details',
    component: HistoryDetails,
    props: true
  },
  {
    path: '/profile/upcoming-workshops',
    name: 'Upcoming Workshops',
    component: Upcoming
  },
  // Bookings
  {
    path: '/rooms',
    name: 'Rooms',
    component: Room
  },
  {
    path: '/rooms/:id',
    name: 'Room Details',
    component: RoomDetails,
    props: true
  },
  {
    path: '/profile/past-bookings',
    name: 'User Past Bookings',
    component: UserPastBookings,
  },
  {
    path: '/profile/bookings',
    name: 'User Bookings',
    component: UserBookings
  },
  // Activities
  {
    path: '/realtime',
    name: 'Real-time Activities',
    component: Activities
  },
  // User
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/profile-report',
    name: 'Profile Report',
    component: ProfileReport,
    meta: {
      isReport: true
    }
  },
  {
    path: '/:pathMatch(.*)*', 
    meta: {
      notFound: true
    } 
  },

  // Admin views
  {
    path: '/admin',
    name: 'Admin Home',
    component: AdminHome,
    meta: {
      isAdmin: true
    }
  },
  {
    path: '/admin/about',
    name: 'Admin About',
    component: AdminAbout,
    meta: {
      isAdmin: true
    }
  },
  {
    path: '/admin/articles',
    name: 'Admin Articles',
    component: AdminArticles,
    meta: {
      isAdmin: true
    }
  },
  {
    path: '/admin/workshop',
    name: 'Admin Workshop',
    component: AdminWorkshop,
    meta: {
      isAdmin: true
    }
  },
  {
    path: '/admin/past-workshop',
    name: 'Admin Past Workshop',
    component: AdminPastWorkshop,
    meta: {
      isAdmin: true
    }
  },
  {
    path: '/admin/workshop/:id',
    name: 'Workshop Users',
    component: WorkshopUsers,
    props: true,
    meta: {
      isAdmin: true
    }
  },
  {
    path: '/admin/past-workshop/:id',
    name: 'Past Workshop Users',
    component: PastWorkshopUsers,
    props: true,
    meta: {
      isAdmin: true
    }
  },
  {
    path: '/admin/workshop/list/:id',
    name: 'Admin Workshop Attendance',
    component: AdminWorkshopAttendance,
    props: true,
    meta: {
      isAdmin: true
    }
  },
  {
    path: '/admin/booking/:id',
    name: 'Admin Booking',
    component: AdminBooking,
    props: true,
    meta: {
      isAdmin: true
    }
  },
  {
    path: '/admin/realtime',
    name: 'Admin Real Time',
    component: AdminRealTime,
    meta: {
      isAdmin: true
    }
  },
  {
    path: '/admin/profile',
    name: 'Admin Profile',
    component: AdminProfile,
    meta: {
      isAdmin: true
    }
  },
  {
    path: '/admin/users',
    name: 'Admin Users',
    component: AdminUsers,
    meta: {
      isAdmin: true
    }
  },
  {
    path: '/admin/messages',
    name: 'Admin Messages',
    component: AdminMessages,
    meta: {
      isAdmin: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'is-active'
})

// Global Route Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isPublic = to.matched.some(record => record.meta.public)
  const onlyLoggedOut = to.matched.some(record => record.meta.onlyLoggedOut)
  const notFound = to.matched.some(record => record.meta.notFound)
  const isAdmin = localStorage.getItem('admin')
  const admin = to.matched.some(record => record.meta.isAdmin)

  //if not logged in and is not a public page, redirect to Login page
  //if not logged in and not found, redirect to login page
  if (!token && !isPublic || (!token && notFound)) next ({ name: 'Login' });

  //if logged in and wants to access login/register/etc pages, redirect to profile page
  //if logged in and wants to access a page that doesn't exist, redirect to profile page
  else if ((token && onlyLoggedOut) || (token && notFound)) next ({ name : 'Profile'});

  //if not admin and wants to access admin pages
  else if (!isAdmin && admin) next ({ name : 'Profile'});
  
  //else continue to the route user intended to access
  else next();
});

export default router
