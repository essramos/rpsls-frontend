<template>

    <div>
        <div class="container container h-100">
              <div class="row h-100 justify-content-center align-items-center">
                <form class="col-4" @submit.prevent="enterGame">
                    <div class="form-group">
                        <label for="exampleInputEmail1">Username</label>
                        <input 
                            class="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                            v-model="username">
                        <small id="emailHelp" class="form-text text-muted">If you've played before, we will retrieve your data.</small>
                    </div>
                    <button type="submit" class="btn btn-primary text-center">Submit</button>
                </form>
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
</style>