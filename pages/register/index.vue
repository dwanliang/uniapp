<template>
    <view class="register">
        <bm-login :base-config="myConfig"
                  v-on:forgetPassword="to_forgetPassword"
                  v-on:phoneLogin="to_phone_login"
                  @parent_login="login">
            <template v-slot:header>
                <view style="display: flex;flex-direction: column;align-items: flex-start;">
                    <h2>用户注册</h2>
                    <h2>账号密码注册</h2>
                </view>
            </template>
        </bm-login>
    </view>
</template>

<script>
	const apps=getApp().globalData.comm;
	import bmLogin from '../../components/bm-login/bm-login.vue'
    export default {
        name: "register",
		components: {
			bmLogin
		},
        data(){
            return{
                myConfig:{
                    forgetPwd_register_protocol: false,
                    //为false时，下面三项设置为true无效
                    rememberPassword:false,
                    quickLogin:true,
                    otherLoginWays: false,
                    login_btn_value:'注册',
                    phone_login_text:'返回账号密码登录'
                }
            }
        },
        methods:{
            //根据配置自行选择需要的方法
            to_forgetPassword(){
                //进入忘记密码页面
				uni.navigateTo({
					url: '../phone-login/index'
				})
            },
            login(input_info){
                var data={user_name:input_info.username,password:input_info.password,type:1};
                this.$request(apps.api.user_add,data).then(res => {
                	apps.tan(res.msg,1000);
                	if(res.code==200){
                		setTimeout(()=>{
                			uni.navigateTo({
                				url:'../login/index'
                			})
                		},1000)
                	}
                })
            },
            to_phone_login(){
                //返回登录页面
				uni.navigateTo({
					url: '../phone-login/index'
				})
            }
        }
    }
</script>

<style scoped>

</style>
