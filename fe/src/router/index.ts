import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/auth/LoginPage.vue'
import RegisterPage from '../pages/auth/RegisterPage.vue'
import VerifyOTPPage from '../pages/auth/VerifyOTPPage.vue'
import BookOrderList from '../components/BookOrderList.vue'
import ChangePasswordPage from '../pages/auth/ChangePasswordPage.vue'
import AddBookPage from '../pages/admin/AddBookPage.vue'
import OrderPage from '../pages/user/OrderPage.vue'
import SearchResultPage from '../pages/user/SearchResultPage.vue'
import ShoppingCartPage from '../pages/user/ShoppingCartPage.vue'
import OrderHistoryPage from '../pages/user/OrderHistoryPage.vue'
import PaymentPage from '../pages/user/PaymentPage.vue'
import UpdateProfilePage from '../pages/user/UpdateProfilePage.vue'
import HomePage from '../pages/HomePage.vue'
import BorrowPage from '../pages/user/BorrowPage.vue'
import BookBorrowList from '../components/BookBorrowList.vue'
const routes = [
  { path: '/', component: HomePage },
  { path: '/borrows', component:BookBorrowList},
  { path: '/books', component:BookOrderList},
  { path: '/login', component: LoginPage },
  { path: '/register/sendOTP', component: RegisterPage },
  { path: '/register/verifyOTP', component: VerifyOTPPage },
  { path: '/changePass/sendOTP', component:ChangePasswordPage},
  { path: '/ChangePass/verifyOTP', component:VerifyOTPPage},
  { path: '/order/:id', component:OrderPage},
  { path: '/admin/book/addbook', component:AddBookPage},
  { path: '/admin/book/updateBook/:id', component:AddBookPage},
  { path: '/search', component: SearchResultPage},
  { path: '/order/shoppingCart', component:ShoppingCartPage},
  { path: '/order/me', component: OrderHistoryPage},
  { path: '/admin/book', component: BookOrderList},
  { path: '/order/pay', component:PaymentPage},
  { path: '/updateProfile', component:UpdateProfilePage},
  { path: '/borrow/:id', component:BorrowPage}
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
