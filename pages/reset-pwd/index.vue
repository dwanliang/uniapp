<template xmlns:v-slot="http://www.w3.org/1999/html">
    <view class="resetPassword">
        <bm-reset-password :base-config="myConfig"
                           :iconsBase64="myIcons"
                           @parent_finish="finish_modify">
            <template v-slot:header>
                <h2>重置密码</h2>
            </template>>
        </bm-reset-password>
    </view>
</template>

<script>
	import bmResetPassword from '../../components/bm-reset-password/bm-reset-password.vue'
    export default {
        name: "resetPassword",
		components: {
			bmResetPassword
		},
        data(){
            return{
                //修改按钮上的文字
                myConfig:{
                    finish_btn_value: '完成'
                },
                //修改图标（默认采用base64格式）
                myIcons:{
                }
            }
        },
        methods:{
            //修改密码完成
            finish_modify(password){
                // console.log(password);
                //发送请求，提交用户输入的新密码

                //跳转到登录页面
                uni.navigateTo({
                	url: '../login/index'
                })
            }
        }
    }
</script>

<style scoped>

</style>
