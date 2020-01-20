<template>

    <div id="login">

    
        <div class="container container h-100">
            <div class="row h-100 justify-content-center align-items-center">
                <div class="card card-outline-secondary">
                    <div class="card-header">
                        <h3 class="mb-0">Login</h3>
                    </div>
                    <div class="card-body">
                        <form class="form"  @submit.prevent="enterGame">
                            <div class="form-group">
                                <label for="uname1">Username</label>
                                <input type="text" v-model="username" class="form-control" name="uname1" id="uname1" required="">
                                <div class="invalid-feedback">Please enter your username or email</div>
                            </div>
                            <button type="submit" class="btn btn-success btn-lg float-right" id="btnLogin">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
export default {
    data() {
        return {
            username: null
        }
    },
    methods: {
        enterGame() {
            if (this.username === null) {
                alert("username cant be blank")
            } else {
                localStorage.setItem('username', this.username)
                this.$router.push({name: 'Main'})
            }
            

        }
    }
    
}
</script>

<style scoped>
#login {
    margin-top:150px;
}

</style>