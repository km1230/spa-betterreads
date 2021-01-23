<template>
  <div class="blue-grey lighten-4 main">
    <v-alert>{{ error }}</v-alert>
    <v-col sm="12" lg="4" offset-lg="4">
      <h2>Add New Book</h2>
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
          ref="imgDropzone"
          id="dropzone"
          :options="dropzoneOptions"
        >
        </vue-dropzone>

        <v-btn class="mr-4" type="submit"> submit </v-btn>
        <v-btn> clear </v-btn>
      </form>
    </v-col>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Book, Category } from '@/api';
import { authModule } from '@/store';
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import { baseUrl } from '@/config';

@Component({
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

  get dropzoneOption() {
    return {
      url: baseUrl,
      thumbnailWidth: 150,
      maxFilesize: 0.5,
      headers: { 'My-Awesome-Header': 'header value' },
    };
  }

  get isStaff() {
    return authModule.isStaff;
  }

  mounted() {
    this.getAllCategories();
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
</style>
