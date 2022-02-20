import { $Casbin } from '@/plugins/casbin';

const getStorage = key => {
  const appName = process.env.VUE_APP_SITENAME || 'app';
  const data = window.localStorage.getItem(`${appName}_${key}`);
  try {
    return JSON.parse(data);
  } catch (Exception) {
    return data;
  }
};

const isAllowed = (to, from, next) => {
  const rol = getStorage('rol');
  const user = getStorage('user');
  if ($Casbin.enforcer) {
    const [sub, obj, act] = [rol || user, to.path, 'read'];
    $Casbin.enforcer
      .enforce(sub, obj, act)
      .then(permitido => {
        if (permitido) {
          next();
        } else {
          next({
            path: '/403',
            replace: true,
          });
        }
      })
      .catch(() => {
        next(false);
      });
  } else {
    const tmpInt = window.setInterval(() => {
      if ($Casbin.enforcer) {
        window.clearInterval(tmpInt);
        $Casbin.enforcer.enforce(rol, to.path, 'read').then(permitido => {
          if (permitido) {
            next();
          } else {
            next({
              path: '/403',
              replace: true,
            });
          }
        });
      }
    }, 100);
  }
};

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/auth/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../components/home/Home'),
  },
  {
    path: '/politicas',
    name: 'Políticas',
    component: () => import('../components/politicas'),
    beforeEnter: isAllowed,
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('../components/usuarios'),
    beforeEnter: isAllowed,
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: () => import('../components/usuarios/Perfil.vue'),
    beforeEnter: isAllowed,
  },
  {
    path: '/bandeja/grupo',
    name: 'BandejaGrupo',
    component: () => import('../components/bandeja/grupo'),
    beforeEnter: isAllowed,
  },
  {
    path: '/bandeja/observados',
    name: 'BandejaObservados',
    component: () => import('../components/bandeja/observados'),
    beforeEnter: isAllowed,
  },
  {
    path: '/juridico/aprobados',
    name: 'JuridicoAprobados',
    component: () => import('../components/juridico/aprobados'),
  },
  {
    path: '/juridico/pendientes',
    name: 'JuridicoPendientes',
    component: () => import('../components/juridico/pendientes'),
  },
  {
    path: '/juridico/observados',
    name: 'JuridicoObservados',
    component: () => import('../components/juridico/observados'),
  },
  {
    path: '/juridico/inscritos',
    name: 'JuridicoAprobados',
    component: () => import('../components/juridico/inscritos'),
  },
  {
    path: '/juridico/revision/:codigo',
    name: 'JuridicoRevisionTramite',
    component: () => import('../components/juridico/TramiteRevision'),
  },
  {
    path: '/juridico/inscrito/:codigo',
    name: 'JuridicoInscritoTramite',
    component: () => import('../components/juridico/TramiteInscrito'),
  },
  {
    path: '/404',
    name: 'notfound',
    component: () => import('../layout/AppNotFound.vue'),
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('../layout/AppForbidden.vue'),
  },
  {
    path: '/desbloqueo',
    name: 'desbloqueo',
    component: () => import('../layout/AppDesbloqueo.vue'),
  },
  {
    path: '*',
    redirect: '/home',
  },
];

export default routes;
