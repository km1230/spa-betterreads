<template>
  <div class="blue-grey lighten-4 main">
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
    <v-row v-if="isStaff">
      <v-col sm="12" class="text-center">
        <h2 class="teal white--text pa-4">Edit Book Detail</h2>
      </v-col>
      <v-col
        sm="12"
        lg="4"
        offset-lg="4"        
        class="grey lighten-4 pa-8 formCol"
        id="detailForm"
      >
        <v-form @submit.prevent="submitForm">
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

          <v-btn block class="amber white--text mr-4 mt-3" type="submit">
            Update
          </v-btn>
          <v-btn
            block
            class="pink white--text mr-4 mt-3"
            @click="editCover = true"
          >
            Upload New Cover
          </v-btn>
          <v-btn
            block
            class="grey lighten-2 mt-2"
            @click="$router.push({ name: 'home' })"
          >
            Cancel
          </v-btn>
        </v-form>
      </v-col>
    

      <v-col sm="12" lg="4" v-if="isEditCover" id="dropzone" class="formCol">
        <vue-dropzone
          id="dropzone"
          :options="dzOptions"
          @vdropzone-success="uploadCoverSuccess"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Book, Category } from '@/api';
import { authModule } from '@/store';
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import { baseUrl } from '@/config';
import router from '@/router';

@Component({
  name: 'AddBook',
  components: {
    vueDropzone: vue2Dropzone,
  },
})
export default class extends Vue {
  categories: Category[] = [];
  categoryNames: string[] = [];
  title: string = '';
  author: string = '';
  category: string = '';
  description: string = '';
  book: Book | null = null;
  editCover: boolean = false;
  error: string = '';

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

  async getBookDetail() {
    try {
      let { data } = await Book.includes('category').find(
        this.$route.params.id,
      );
      this.book = data;
      this.title = data.title;
      this.author = data.author;
      this.description = data.description;
      this.category = data.category.name;
    } catch (e) {
      this.error = e.response ? e.response.errors : 'Unknown error';
    }
  }

  async submitForm() {
    try {
      // get category instance
      let response = await Category.where({ name: this.category }).all();
      let cat = response.data ? response.data[0] : null;

      // Add new Book with / without image
      let { data } = await Book.find(this.$route.params.id);

      if (data && cat) {
        data.title = this.title;
        data.author = this.author;
        data.description = this.description;
        data.category = cat;
        await data.save();
      }
      this.$router.push({
        name: 'book-detail',
        params: { id: this.$route.params.id },
      });
    } catch (e) {
      this.error = e.response ? e.response.errors : 'Unknown error';
    }
  }

  uploadCoverSuccess(file: File, response: Response) {
    if (file) this.$router.push({ name: 'all-books' });
  }

  get isEditCover() {
    if(this.editCover) {
      let detailForm = document.querySelector('#detailForm');
      detailForm.classList.remove('offset-lg-4');
      detailForm.classList.add('offset-lg-2')
    }
    return this.editCover;
  }

  get bookDetail() {
    return this.book;
  }

  get isStaff() {
    return authModule.isStaff ? true : this.$router.push({ name: 'home' });
  }

  get dzOptions() {
    let dropzoneOptions: {} = {
      url: this.book ? `${this.book?.klass.url(this.book.id)}cover/` : '',
      maxFiles: 1,
      paramName: 'cover',
      dictDefaultMessage: 'Drop & upload 1 image as the book cover.',
      acceptedFiles: 'image/*',
      resizeHeight: 400,
      renameFile: this.book ? `${this.book.title}_cover.png` : null,
      method: 'PATCH',
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Token ${authModule.sessionToken}`,
        // 'X-CSRFTOKEN': Cookies.get('csrftoken'),
      },
    };
    return dropzoneOptions;
  }

  mounted() {    
    this.getBookDetail();
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
#dropzone {
  border-radius: 8px;
  margin-top: 12px;
}

.dz-image {
  img {
    width: 200px;
  }
}

.formCol {
  transition: all 1s cubic-bezier(.24,.47,.22,.91);
}
</style>
