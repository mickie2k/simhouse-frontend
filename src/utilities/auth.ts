	
    import cookies from 'js-cookie';

    export const checkisLoginByCookie = ():boolean => {
        const cookiesData = cookies.get('isAuth');
		let isLogin = false;
		if(cookiesData === 'true'){
            isLogin = true;
        }
		return isLogin;
	};