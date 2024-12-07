// import React, { useContext } from 'react'
// import { createStackNavigator } from '@react-navigation/stack'
// import { observer } from 'mobx-react-lite'
// import { authRoutes, publicRoutes } from '../routes'
// import { Context } from '../index'

// const Stack = createStackNavigator()

// const AppRouter = observer(() => {
//   const { user } = useContext(Context)

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {user.isAuth &&
//         authRoutes.map(({ path, Component }) => (
//           <Stack.Screen key={path} name={path} component={Component} />
//         ))}
//       {publicRoutes.map(({ path, Component }) => (
//         <Stack.Screen key={path} name={path} component={Component} />
//       ))}
//     </Stack.Navigator>
//   )
// })

// export default AppRouter
