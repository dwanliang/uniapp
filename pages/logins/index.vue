<template>
    <view class="login">
		<view>
			<bm-login :base-config="myConfig"
			          v-on:phoneLogin="to_phoneLogin"
			          v-on:forgetPassword="to_forgetPassword"
			          v-on:toProtocol="to_protocol"
			          v-on:register="to_register"
					  v-on:qqLogin="qq_login"
			          @parent_rememberMe="rememberMe"
			          @parent_login="login">
			    <template v-slot:header>
			        <h2>请输入账号密码</h2>
			    </template>
			</bm-login>
		</view>
    </view>
</template>

<script>
	import bmLogin from '../../components/bm-login/bm-login.vue'
	const apps=getApp().globalData.comm;
    export default {
        name: "login",
		components: {
			bmLogin
		},
        data(){
            return{
                myConfig:{
                    //根据需要自行配置
                    forgetPwd_register_protocol: true,
                    forgetPassword:true,
                    register:true,
                    protocol:true,
                    quickLogin:true,
                    otherLoginWays: true
                },
				login_sate:false,
            }
        },
		onLoad() {

		},
        methods:{
            to_phoneLogin(){
				uni.navigateTo({
					url: '../phone-login/index'
				})
            },
            to_forgetPassword(){
				uni.navigateTo({
					url: '../reset-pwd/index'
				})
            },
            // 用户协议
            to_protocol(){

            },
            login(input_info){
				var data={user_name:input_info.username,password:input_info.password};
				this.$request(apps.api.login,data).then(res => {
					apps.tan(res.msg,1000);
					if(res.code==200){
						uni.setStorageSync('input_info', res.data);
						setTimeout(()=>{
							uni.reLaunch({
								url:'../ge/index'
							})
							// uni.reLaunch()
						},1000)
					}
				})
				
            },
            to_register(){
				uni.navigateTo({
					url: '../register/index'
				})
            },
			qq_login() {
				// #ifdef H5
				apps.tan('网页版不支持第三方登录！',1000);
				return;
				// #endif
				var vm = this;
				uni.login({
					provider: "qq",
					success: (resp) => {
						console.log(resp)
						var access_token=resp.authResult.access_token;
						uni.getUserInfo({
						    provider: 'qq',
						    success: function (infoRes) {
								var formdata={
									nickName:infoRes.userInfo.nickname,
									gender:infoRes.userInfo.gender=='男'?0:1,
									openId:infoRes.userInfo.openid,
									access_token:access_token,
								};
								
							}
						})
					},
					fail: (err) => {}
				});
			}
        }
    }
</script>

<style>
	
</style>
