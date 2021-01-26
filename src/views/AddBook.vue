<template>
  <div class="blue-grey lighten-4 main">
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <v-row>
      <v-col sm="12" class="justify-center">
        <h2 class="teal white--text">Add New Book</h2>
      </v-col>
      <v-col sm="12" lg="4" offset-lg="4" v-if="isStaff">
        <form>
          <v-text-field
            v-model="title"
            :counter="50"
            label="Book Title"
            required
          ></v-text-field>
          <v-text-field
            v-model="author"
            :counter="20"
            label="Author"
            required
          ></v-text-field>
          <v-select
            v-model="category"
            :items="categoryNames"
            label="Category"
            required
          ></v-select>
          <v-text-field
            v-model="description"
            :counter="200"
            label="Description"
            required
          ></v-text-field>

          <vue-dropzone
            id="dropzone"
            ref="dropzone"            
            :options="dropzoneOptions"            
            @vdropzone-thumbnail="AddImageFile"
          />
  
          <v-btn block class="blue white--text mr-4 mt-3" type="submit"> submit </v-btn>
          <v-btn block class="grey lighten-2 mt-2" @click="$router.push({name: 'home'})"> Cancel </v-btn>
        </form>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Book, Category } from '@/api';
import { authModule } from '@/store';
import vue2Dropzone from 'vue2-dropzone';
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { baseUrl } from '@/config';
import minioClient from '@/components/MinioClient';
import DataUriToBuffer from 'data-uri-to-buffer';
import dataUriToBuffer from 'data-uri-to-buffer';

@Component({
  name: 'AddBook',
  components: {    
    vueDropzone: vue2Dropzone,
  },
})
export default class extends Vue {
  categories: Category[] = [];
  error: string = '';
  categoryNames: string[] = [];
  title: string = '';
  author: string = '';
  category: string = '';
  description: string = '';
  dropzoneOptions: {} = {
    url: 'http://localhost:9000',
    thumbnailWidth: 150,
    maxFiles: 1,
    dictDefaultMessage: 'Drop & upload an image of the book cover.',
    acceptedFiles: 'image/*',
    autoProcessQueue: false
  };
  bucketName: string = 'bookcovers';
  imageFileName: string = '';
  readableStream: string = '';

  async getAllCategories() {
    try {
      let { data } = await Category.all();
      this.categories = data;
      this.categories.forEach((c) => {
        this.categoryNames.push(c.name);
      });
    } catch (e) {
      this.error = e.response ? e.response.errors[0].detail : 'Unknown error';
    }
  }

  AddImageFile(file: File, dataURL: string) {
    // Rename file    
    let extension = file.type.split("/")[1];
    this.imageFileName = `${this.title}_cover.${extension}`;    
    this.readableStream = dataUriToBuffer(dataURL).toString();
    // MinioClient upload file to bucket
    if(file) {
      minioClient.putObject(this.bucketName, this.imageFileName, this.readableStream, (err, etag) => {
        console.log(err, etag)
      })
    }
  }

  checkMinioBucket() {
    minioClient.bucketExists(this.bucketName, (err, exists) => {
      if (err) this.error = err.toString();
      if (!exists) this.makeBucket();
    }) 
  }

  makeBucket() {
    minioClient.makeBucket(this.bucketName, '', (err) => {
      if(err) this.error = err.toString();
    })
  }

  get isStaff() {
    return (authModule.isStaff) ? true : this.$router.push({name: 'home'})
  }

  mounted() {
    this.getAllCategories();
    this.checkMinioBucket();
  }
}
</script>

<style lang="scss">
.error {
  background-color: red;
  color: white;
  font-size: 1rem;
  padding: 10px;
}
.main {
  padding: 20px;
}
#dropzone {
  border-radius: 8px;
  margin-top: 12px;
}
</style>
