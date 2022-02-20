<template>
  <v-card elevation="0">
    <section>
      <small>Bandeja de Pendientes</small>
      <p>&nbsp;</p>
      <h2>Bandeja de Pendientes</h2>
      <p>En esta sección podrás iniciar la atención a los trámites asignados a ti.</p>
    </section>
    <section>
      <crud-table
        ref="crudTable"
        description="Trámites observados"
        :headers="headers"
        :filters.sync="filters"
        :url.sync="url"
        :widthModal="500"
        :show-filter-init="true"
        :custom="false"
        :show-filter-options="false"
        :omitir-carga-on-mounted="false"
      >
        <template slot="LEFT_FILTERS">
          <v-menu
            ref="menuFechaInicio"
            v-model="menuFechaInicio"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="fFechaInicio"
                label="Desde"
                hint="Fecha de recepcion"
                prepend-icon="mdi-calendar"
                persistent-hint
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                readonly
                :style="
                  !['xs'].includes($vuetify.breakpoint.name) ?
                  'width: 200px; max-width: 200px' : ''"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fFechaInicio"
              no-title
              @input="menuFechaInicio = false"
              v-on:change="getData"
            >
            </v-date-picker>
          </v-menu>
          <v-menu
            ref="menuFechaFin"
            v-model="menuFechaFin"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="fFechaFin"
                label="Hasta"
                hint="Fecha de recepcion"
                prepend-icon="mdi-calendar"
                persistent-hint
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                readonly
                :style="
                  !['xs'].includes($vuetify.breakpoint.name) ?
                  'width: 200px; max-width: 200px' : ''"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fFechaFin"
              no-title
              @input="menuFechaFin = false"
              v-on:change="getData"
            >
            </v-date-picker>
          </v-menu>
        </template>
        <template slot="RIGHT_FILTERS">
          <v-btn
            color="primary"
            small
            @click="getDataLimpiar(this, true)"
          >LIMPIAR</v-btn>
        </template>
        <template slot="ACTIONS" slot-scope="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="primary"
                v-if="item.id"
                @click="pendienteRevision(item)"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon-component icon="play_circle_filled" />
              </v-btn>
            </template>
            <span>Procesar</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="primary"
                v-if="item.id"
                @click="seguimiento(item)"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon-component icon="timeline" />
              </v-btn>
            </template>
            <span>Seguimiento</span>
          </v-tooltip>
        </template>
        <template slot="items" slot-scope="items">
          <tr>
            <td></td>
            <td>{{ items.items.parametrica.nombre }}</td>
            <td>{{ formatFecha(items.items.fechaCreacion) }}</td>
          </tr>
        </template>
        <template  v-slot:NO_DATA>
          La bandeja se encuentra vacía
        </template>
      </crud-table>
    </section>
    <modal-seguimiento v-model="showSeguimiento" :codigo="codigo"></modal-seguimiento>
  </v-card>
</template>
<script>
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import dayjs from 'dayjs';

import ModalSeguimiento from './modal/Seguimiento.vue';

const urlMisTramites = 'juridico/pendientes';

const headers = [
  {
    text: 'Acciones',
    divider: false,
    sortable: false,
    align: 'left',
    value: 'ACTIONS',
  },
  {
    text: 'Modalidad',
    sortable: false,
    value: 'parametrica.tipo'
  },
  {
    text: 'Trámite',
    sortable: true,
    sortkey: 'p.nombre',
    align: 'left',
    value: 'parametrica.nombre',
  },
  {
    text: 'Código',
    sortable: false,
    align: 'left',
    value: 'codigo',
  },
  {
    text: 'Empresa',
    sortable: true,
    sortkey: 'e.razon_social',
    align: 'left',
    value: 'empresa.razonSocial',
  },
  {
    text: 'Fecha de ingreso',
    sortable: true,
    sortkey: 't.fecha_solicitud',
    align: 'left',
    value: 'fechaSolicitud',
  },
  {
    text: 'Fecha de reingreso',
    sortable: true,
    sortkey: 't.fecha_reingreso',
    align: 'left',
    value: 'fechaReingreso',
  },
  {
    text: 'Estado',
    sortable: false,
    align: 'left',
    value: 'estado',
  },
];

export default {
  components: { CrudTable, ModalSeguimiento },
  data: () => ({
    url: urlMisTramites,
    headers: headers,
    filters: [
      {
        label: 'Código de trámite',
        field: 'codigo',
        type: 'text',
        typeG: 'String',
      },
      {
        label: 'Nombre del trámite',
        field: 'tramite',
        type: 'text',
        typeG: 'String',
      }
    ],
    dateRange: [(
      new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)
    ).toISOString().substr(0, 10),
    (
      new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)
    ).toISOString().substr(0, 10)],
    searchRange: false,
    fFechaInicio: null,
    menuFechaInicio: false,
    fFechaFin: null,
    menuFechaFin: false,
    showSeguimiento: false,
    codigo: '',
  }),
  methods: {
    cerrarSearchRange () {
      console.log('Cerrando');
    },
    pendienteRevision (item) {
      this.$service.put(`juridico/pendientes/${item.id}/revision`)
        .then((resp) => {
          if (resp && resp.finalizado) {
            this.$router.push(`/juridico/revision/${item.id}`);
          } else {
            this.$message.warning(
              resp.mensaje || 'No se puede iniciar la revisión del trámite.'
            );
          }
        });
    },
    seguimiento(item) {
      this.codigo = `${item.id}`;
      this.showSeguimiento = true;
    },
    getDataLimpiar() {
      let sw = false;
      this.fFechaInicio = null;
      this.fFechaFin = null;
      if (this.$refs.crudTable && this.$refs.crudTable.getData) {
        if (this.$refs.crudTable.search) {
          if (this.$refs.crudTable.search.codigo) {
            this.$refs.crudTable.search.codigo = undefined;
            sw = true;
          }
          if (this.$refs.crudTable.search.tramite) {
            this.$refs.crudTable.search.tramite = undefined;
            sw = true;
          }
          if (this.$refs.crudTable.search.fechaIngreso) {
            this.$refs.crudTable.search.fechaIngreso = undefined;
            sw = true;
          }
        }
      }
      if (sw) {
        this.$refs.crudTable.getData(true, {});
      }
    },
    getData() {
      if (this.$refs.crudTable && this.$refs.crudTable.getData) {
        const customQuery = {};
        if (!this.fFechaInicio || !this.fFechaFin) return;
        if (this.fFechaInicio > this.fFechaFin) return;
        customQuery.fechaIngreso = JSON.stringify({
          desde: this.fFechaInicio,
          hasta: dayjs(dayjs(this.fFechaFin).add(1, 'day'))
            .format('YYYY-MM-DD'),
        });
        this.$refs.crudTable.getData(false, customQuery);
      }
    },
  },
};
</script>
