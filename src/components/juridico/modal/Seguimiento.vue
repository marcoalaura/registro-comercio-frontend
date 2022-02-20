<template>
  <v-dialog
    persistent
    v-model="show"
    max-width="480px"
    id="dialog-timeline"
    content-class="ma-0"
  >
    <v-card>
      <v-card-title>
        Seguimiento {{ codigo }}
      </v-card-title>
      <v-card-text style="overflow:auto;min-height:240px;max-height:600px;">
        <div style="max-width: 480px;">
          <v-timeline
            dense
            clipped
          >
            <v-timeline-item
              fill-dot
              class="white--text mb-12"
              color="orange"
              large
              v-if="false"
            >
              <template v-slot:icon>
                <span>JL</span>
              </template>
              <v-text-field
                v-model="input"
                hide-details
                flat
                label="Deja un comentario..."
                solo
                @keydown.enter="comment"
              >
                <template v-slot:append>
                  <v-btn
                    class="mx-0"
                    depressed
                    icon
                    @click="comment"
                  >
                    <v-icon>send</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-timeline-item>

            <v-slide-x-transition
              group
            >
              <v-timeline-item
                v-for="event in timeline"
                :key="event.id"
                class="mb-4"
                color="pink"
                small
              >
                <v-row justify="space-between">
                  <v-col
                    cols="12"
                    v-text="event.text"
                  ></v-col>
                  <v-col
                    class="text-right"
                    cols="12"
                    v-text="event.time"
                  ></v-col>
                </v-row>
              </v-timeline-item>
            </v-slide-x-transition>

            <v-timeline-item
              class="mb-6"
              hide-dot
            >
              <v-row justify="space-between">
                <v-col cols="12">
                  <span>AHORA:</span> Revisando seguimiento...
                </v-col>
                <v-col
                    class="text-right"
                    cols="12"
                  >
                  {{ ahora() }}
                </v-col>
              </v-row>
            </v-timeline-item>

            <v-timeline-item
              class="mb-4"
              color="grey"
              icon-color="grey lighten-2"
              small
            >
              <v-row justify="space-between">
                <v-col cols="12">
                  Reingreso de tramite
                </v-col>
                <v-col
                  class="text-right"
                  cols="12"
                >
                  02/01/2022 15:26
                </v-col>
              </v-row>
            </v-timeline-item>

            <v-timeline-item
              color="red"
              class="mb-4"
              small
            >
              <v-row justify="space-between">
                <v-col cols="12">
                  <v-chip
                    class="white--text ml-0"
                    color="purple"
                    label
                    small
                  >
                    Observado
                  </v-chip>
                  Observacion en el trámite
                </v-col>
                <v-col
                  class="text-right"
                  cols="12"
                >
                  02/01/2022 08:25
                </v-col>
              </v-row>
            </v-timeline-item>

            <v-timeline-item
              class="mb-4"
              color="grey"
              small
            >
              <v-row justify="space-between">
                <v-col cols="12">
                  Revisión
                </v-col>
                <v-col
                  class="text-right"
                  cols="12"
                >
                  01/01/2022 17:25
                </v-col>
              </v-row>
            </v-timeline-item>

            <v-timeline-item
              class="mb-4"
              color="grey"
              small
            >
              <v-row justify="space-between">
                <v-col cols="12">
                  Solcitud de trámite
                </v-col>
                <v-col
                  class="text-right"
                  cols="12"
                >
                  01/01/2022 15:25
                </v-col>
              </v-row>
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click.stop="show = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import dayjs from 'dayjs';

export default {
  props: {
    value: {
      default: false,
      type: Boolean,
    },
    codigo: {
      default: '',
      type: String,
    }
  },
  data: () => ({
    events: [],
    input: null,
    nonce: 0,
  }),
  computed: {
    show: {
      get () {
        return this.value;
      },
      set (value) {
        console.log(value);
        this.$emit('input', value);
      },
    },
    timeline () {
      return this.events.slice().reverse();
    },
  },
  methods: {
    ahora() {
      return dayjs(Date.now()).format('DD/MM/YYYY hh:mm');
    },
    comment () {
      const time = dayjs(Date.now()).format('DD/MM/YYYY hh:mm');
      this.events.push({
        id: this.nonce++,
        text: this.input,
        time,
      });

      this.input = null;
    },
  },
  beforeUpdate () {
    console.log('Obtener seguimiento?', this.value);
  },
};
</script>
