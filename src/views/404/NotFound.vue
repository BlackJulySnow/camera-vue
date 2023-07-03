<template>
    <div class="row" style="margin-top:30px; width: 100%;">
        <div class="col-2"></div>
        <div class="col-8">
            <div class="card">
                <div class="card-body">
                    <video controls autoplay ref="dialogVideo">
                        <source :src="'http://127.0.0.1/video/stream/' + this.$route.params.id" type='video/mp4'>
                    </video>
                </div>
            </div>
        </div>
    </div>
    <div class="col-2"></div>
</template>
<script>
</script>