<template>
  <AppContainerLayout>
    <template #prepend>
      <v-icon @click.stop="drawer = !drawer" class="mr-3" v-if="breakpoint">mdi mdi-menu</v-icon>
    </template>
    <v-flex>
      <v-navigation-drawer v-model="drawer" :mobile-breakpoint="mobileBreakpoint" clipped app>
        <v-list nav>
          <v-list-item @click="router.push({path: item.path})" :value="selectMenuItem" v-for="(item) in menuItems" :key="item.title"
            link>
            <v-row>
              <v-col cols="2"><v-icon>{{ item.icon }}</v-icon></v-col>
              <v-col cols="auto">{{ item.title }}</v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <notificationList :notificationsList="uiStore.notifications"></notificationList>
        <div class="pl-16 pr-16 pb-6 pt-6">
          <slot></slot>
        </div>
      </v-main>
    </v-flex>
  </AppContainerLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {useUIStore} from "../store";
import AppContainerLayout from "./default.vue";
import { getCurrentInstance } from "vue";
import notificationList from "../components/NotificationList.vue";

const selectMenuItem = ref();
const uiStore = useUIStore();
const router = useRouter();

const breakpoint = computed(() => {
  return getCurrentInstance()?.proxy?.$vuetify?.display.smAndDown;
});

const mobileBreakpoint = ref(getCurrentInstance()?.proxy?.$vuetify?.display.thresholds.sm);

const drawer = ref(true);

const menuItems = [
  {
    title: "Home",
    icon: "mdi-chart-donut",
    path: '/home',
  }
];

onMounted(() => {
  selectMenuItem.value = menuItems.findIndex(item => item.path == router.currentRoute.value.path);
})

</script>