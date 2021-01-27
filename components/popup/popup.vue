<template>
    <view class="prompt">
        <!-- prompt弹窗插件 -->
			
        <view class="prompt-box" v-if="isHidden" @click.stop="!show">
            <view class="prompt-content contentFontColor">
                <view class="prompt-title">{{title}}</view>
				
                <input class="prompt-input" type="text" v-model="value" :placeholder="placeholder" v-if="type=='user'" />
				<input class="prompt-input" type="text" v-model="value" placeholder="邀请码" v-if="type=='team'" />
				<block v-if="type=='pass'">
					旧密码:<input class="prompt-input" v-model="passwords" type="password"/>
					新密码:<input class="prompt-input" v-model="password" type="password"/>
					确认新密码:<input class="prompt-input" v-model="pass" type="password"/>
				</block>
                <view class="prompt-btn-group">
                    <button class="btn-item prompt-cancel-btn contentFontColor" @tap="_cancel">取消</button>
                    <button class="btn-item prompt-certain-btn" @tap="_confirm">确定</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    // var http = require("../../utils/http.js");

    export default {
        data() {
            return {
                text: '',
                isHidden: false,
                value: '',//数据
                number: 1,
				title:'',//标题
				type:'',//类型
				placeholder:'',
				password:'',//新密码
				pass:'',//确认新密码
				passwords:''//旧密码
            };
        },

        components: {},
        props: {

        },
        computed: {
            // i18n() {
            //     return this.$t('index')
            // }
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {
            //加载分销员推广
            // console.log(decodeURIComponent(options.scene))
            //   this.setData({
            //     scene: options.scene
            //   });
            //   this.getClaimerList(this.shopid);
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {},

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function() {
            //头部导航标题
            uni.setNavigationBarTitle({
                title: this.i18n.logisticsDetails
            });
        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function() {},

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function() {},

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function() {},

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function() {},

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function() {},
        methods: {
            show: function() {
                this.isHidden = !this.isHidden;
            },

            /*
             * 内部私有方法建议以下划线开头
             * triggerEvent 用于触发事件
             */
            _cancel() {
                //触发cancel事件，即在外部，在组件上绑定cancel事件即可，bind:cancel，像绑定tap一样
                this.value = this.value;
                this.isHidden = !this.isHidden;
            },
            _confirm() {
				if(this.type=='user'){
					let value = this.value;
					if (value == '') {
						uni.showModal({
							title: '用户名不能为空!',
						});
						return;
					} else {
						this.isHidden = !this.isHidden;
						this.$emit("submit", {
							value: value,
							type:this.type,
						});
					}
				}else if(this.type=='pass'){
					let password=this.password;
					let passwords=this.passwords;
					let pass=this.pass;
					if(!passwords){
						uni.showModal({
							title: '旧密码为空!',
						});
						return;
					}
					if(!password){
						uni.showModal({
							title: '新密码为空!',
						});
						return;
					}
					if(!pass){
						uni.showModal({
							title: '请重复新密码!',
						});
						return;
					}
					if(pass!==password){
						uni.showModal({
							title: '新密码不一致!',
						});
						return;
					}
					if(passwords==password){
						uni.showModal({
							title: '新密码与旧密码一致!',
						});
						return;
					}
					let value={password:password,passwords:passwords}
					this.isHidden = !this.isHidden;
					this.$emit("submit", {
						value: value,
						type:this.type,
					});
				}
            }
        }
    }
	
</script>
<style>
    @import "./popup.css";
</style>