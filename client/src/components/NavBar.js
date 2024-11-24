import React, { useContext } from 'react'
import { Context } from '../index'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { NavLink } from 'react-router-dom'
import {
  ADMIN_ROUTE,
  BASKET_ROUTE,
  LOGIN_ROUTE,
  SHOP_ROUTE,
} from '../utils/consts'
import { Button, Badge } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import Container from 'react-bootstrap/Container'
import { FaBasketShopping } from 'react-icons/fa6'
import { FaUser } from 'react-icons/fa6'
import { useHistory } from 'react-router-dom'

const NavBar = observer(() => {
  const { user, basket } = useContext(Context)
  const history = useHistory()

  const logOut = () => {
    user.setUser({})
    user.setIsAuth(false)
    basket.setBasketDevices([])
    localStorage.removeItem('token')
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <NavLink style={{ color: 'white' }} to={SHOP_ROUTE}>
          КупиДевайс
        </NavLink>
        {user.isAuth ? (
          <Nav className="ml-auto" style={{ color: 'white' }}>
            <div
              style={{ position: 'relative' }}
              onClick={() => history.push(BASKET_ROUTE)}
            >
              <FaBasketShopping
                style={{ marginRight: 10, marginTop: 4, cursor: 'pointer' }}
                size={30}
              />
              <Badge
                style={{
                  position: 'absolute',
                  right: 6,
                  bottom: 0,
                  backgroundColor: 'purple',
                  borderRadius: 5,
                  cursor: 'pointer',
                }}
                bg="danger"
              >
                {basket.basketDevices.length}
              </Badge>
            </div>
            <FaUser
              style={{
                marginRight: 10,
                marginLeft: 10,
                marginTop: 6,
                cursor: 'pointer',
              }}
              size={28}
              onClick={() => history.push('/profile')}
            />
            {user.user?.role === 'ADMIN' && (
              <Button
                variant={'outline-light'}
                onClick={() => history.push(ADMIN_ROUTE)}
              >
                Админ панель
              </Button>
            )}
            <Button
              variant={'outline-light'}
              onClick={() => logOut()}
              className="ml-2"
            >
              Выйти
            </Button>
          </Nav>
        ) : (
          <Nav className="ml-auto" style={{ color: 'white' }}>
            <Button
              variant={'outline-light'}
              onClick={() => history.push(LOGIN_ROUTE)}
            >
              Авторизация
            </Button>
          </Nav>
        )}
      </Container>
    </Navbar>
  )
})

export default NavBar
