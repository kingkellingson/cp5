<template>
<div>
  <section class="image-gallery">
    <div class="image" v-for="photo in photos" v-bind:key="photo._id" @click="selectPhoto(photo)">
      <router-link class="photoLink" :to="{ name: 'photo', params: { id: photo._id, path: photo.path }}"><img :src="photo.path" /></router-link>
      <div class="photoInfo">
        <p class="photoTitle">{{photo.title}}</p>
        <p class="photoName">{{photo.user.firstName}} {{photo.user.lastName}}</p>
      </div>
      <p class="photoDate">{{formatDate(photo.created)}}</p>
    </div>
  </section>
</div>
</template>


<script>
import moment from 'moment';
//import Photo from '@/components/Photo.vue';
export default {
  name: 'ImageGallery',
  // components: {
  //   Photo,
  // },
  data() {
    return {
     selectedPhoto: null,
    }
  },
  props: {
    photos: Array
  },
  methods: {
    formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 15)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    },
    selectPhoto(photo) {
      this.selectedPhoto = photo;
      console.log("you have selected this photo: ", this.selectedPhoto);
    },
  }
}
</script>



<style scoped>

.photoLink {
  transition: box-shadow .3s;
}

.photoLink:hover {
  box-shadow: 0 0 11px rgba(33,33,33,.2); ;
}

.photoInfo {
  display: flex;
  justify-content: space-between;
  font-size: 0.8em;
}

.photoInfo p {
  margin: 0px;
}

.photoDate {
  font-size: 0.7em;
  font-weight: normal;
}

p {
  margin: 0px;
}

/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}

.image-gallery {
  column-gap: 1em;
}

.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}

.image img {
  width: 100%;
}

/* Masonry on large screens */
@media only screen and (min-width: 1024px) {
  .image-gallery {
    column-count: 4;
  }
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .image-gallery {
    column-count: 3;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 540px) {
  .image-gallery {
    column-count: 2;
  }
}
</style>


