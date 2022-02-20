<template>
  <v-card elevation="0" class="crud-table backgroundColor">
    <section>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="1024px"
        max-auto
      >
        <v-card
          class="=mx-auto"
          max-width="1024px"
        >
        <v-container fluid>
          <v-card-title>
            <span class="text-h5">Revisar observaciones</span>
            <v-spacer></v-spacer>
            <span align="rigth">
              <v-btn
                icon
                class="mx-2"
                @click="dialog = false"
              >
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <span class="text-h2"><b>Observaciones</b></span>
                <table class="tabla" width='100%' border="1" cellspacing="0"
                  style="border-color: #eee; border-padding: 5px"
                >
                  <thead>
                    <tr>
                      <th width="5%" style="padding: 10px">Nro.</th>
                      <th width="20%" class="text-center" style="padding: 7px">
                        Casilla
                      </th>
                      <th width="20%" class="text-center" style="padding: 7px">
                        Valor Actual
                      </th>
                      <th width="50%" class="text-center" style="padding: 7px">
                        Observación
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-center">1</td>
                      <td style="padding: 7px;">
                        Departamento
                      </td>
                      <td style="padding: 7px;">La Paz</td>
                      <td style="padding: 7px;">
                        El dato consignado no coincide con las coordenadas
                         correspondientes a la ubicacion georeferenciada
                      </td>
                    </tr>
                    <tr>
                      <td class="text-center">2</td>
                      <td style="padding: 7px;">
                        Departamento
                      </td>
                      <td style="padding: 7px;">La Paz</td>
                      <td style="padding: 7px;">
                        El dato consignado no coincide con las coordenadas
                         correspondientes a la ubicacion georeferenciada
                      </td>
                    </tr>
                    <tr>
                      <td class="text-center">3</td>
                      <td style="padding: 7px;">
                        Departamento
                      </td>
                      <td style="padding: 7px;">La Paz</td>
                      <td style="padding: 7px;">
                        El dato consignado no coincide con las coordenadas
                         correspondientes a la ubicacion georeferenciada
                      </td>
                    </tr>
                    <tr>
                      <td class="text-center">4</td>
                      <td style="padding: 7px;">
                        Departamento
                      </td>
                      <td style="padding: 7px;">La Paz</td>
                      <td style="padding: 7px;">
                        El dato consignado no coincide con las coordenadas
                         correspondientes a la ubicacion georeferenciada
                      </td>
                    </tr>
                  </tbody>
                </table>
            </v-container>
            <v-container>
              <span class="text-h2"><b>Observaciones Generales</b></span>
                <table class="tabla" width='100%' border="1" cellspacing="0"
                  style="border-color: #eee; border-padding: 5px"
                >
                  <thead>
                    <tr>
                      <th width="5%" class="text-center" style="padding: 7px;">Nro.</th>
                      <th width="95%" class="text-left" style="padding: 7px;">
                        Observación
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-center">1</td>
                      <td style="padding: 7px;">La ubicacion georeferenciada no
                          corresponde a los datos de dirección declarados</td>
                    </tr>
                    <tr>
                      <td class="text-center">2</td>
                      <td style="padding: 7px;">La ubicacion georeferenciada no
                          corresponde a los datos de dirección declarados</td>
                    </tr>
                  </tbody>
                </table>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="dialog = false"
            >
              Aceptar
            </v-btn>
          </v-card-actions>
        </v-container>
        </v-card>
      </v-dialog>
    </section>
    <section>
      <small>Bandeja de Observados</small>
      <p>&nbsp;</p>
      <h2>Bandeja de Observados</h2>
      <p>
        En esta sección podrá revisar los trámites que rechazaste y sus
        observaciones.
      </p>
    </section>
    <!-- INICIO SECCION DE BUSCADORES -->
    <section class="pa-1 mb-4">
    <v-row no-gutters class="mt-2 mb-2">
      <v-col cols="12" class="d-flex flex-row align-center justify-start">
        <slot name="extra-row"></slot>
      </v-col>
      <slot name="customFilters"></slot>
      <v-col
        cols="12"
        class="d-flex flex-row align-center justify-space-between"
      >
        <!-- Section buttons -->
        <v-card
          elevation="0"
          :class="
            ['xs', 'sm'].includes($vuetify.breakpoint.name) ? 'fs8' : 'fs10'
          "
          class="subtitle fontColor--text pl-4 d-flex
            flex-row align-center justify-center"
        >
          <v-icon-component :icon="icon" class="mr-2" />
        </v-card>
        <v-card elevation="0" class="d-flex flex-row">
          <slot name="buttons"></slot>
          <!-- Section Filters -->
          <v-card
            elevation="0"
            class="btn-filter"
            :class="{ active: showFilter }"
            v-if="filters"
          >
            <v-tooltip bottom color="color1">
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  :small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                  @click.native="filtrar()"
                  :id="idFilter"
                  class="color1--text btn-filter"
                  v-on="on"
                >
                  <v-icon-component icon="search" color="color1" />
                </v-btn>
              </template>
              <span> Buscar </span>
            </v-tooltip>
          </v-card>
          <v-tooltip bottom color="color1">
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                :small="['xs', 'sm'].includes($vuetify.breakpoint.name)"
                @click.native="recarga()"
                :class="`color1--text ${idRefresh} mr-3`"
                v-on="on"
              >
                <v-icon-component icon="refresh" />
              </v-btn>
            </template>
            <span> Actualizar listado </span>
          </v-tooltip>
        </v-card>
        <!-- END Section buttons -->
      </v-col>
      <!-- Section Filter -->
      <v-col
        cols="12"
        lg="12"
        md="12"
        sm="12"
        class="mt-3"
        v-if="showFilter"
      >
        <transition name="slide-fade">
          <v-container fluid class="container--filter backgroundColor">
            <v-row no-gutters style="width: 97%">
              <v-col
                  :cols="12"
                  :class="[
                  !['xs'].includes($vuetify.breakpoint.name)
                    ? 'd-flex flex-row align-center justify-start flex-wrap'
                    : ''
                ]"
              >
                <!-- INICIO FILTROS DE BUSQUEDA -->
                <v-container style="border:1px solid #ddd;
                -moz-border-radius: 7px; -webkit-border-radius: 7px;">
                  <h3>Herramientas de búsqueda</h3><br>
                  <v-row>
                    <v-col cols="12" sm="6" md="2">
                      <v-menu
                        ref="ver_inicio"
                        v-model="ver_inicio"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="inicio"
                            label="Desde"
                            hint="Fecha de Observación"
                            prepend-icon="mdi-calendar"
                            persistent-hint
                            v-bind="attrs"
                            v-on="on"
                            readonly
                            dense
                            outlined
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="inicio"
                          no-title
                          @input="ver_inicio = false"
                        >
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                      <v-menu
                        ref="ver_fin"
                        v-model="ver_fin"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="fin"
                            label="Hasta"
                            hint="Fecha de Observación"
                            prepend-icon="mdi-calendar"
                            persistent-hint
                            v-bind="attrs"
                            v-on="on"
                            readonly
                            dense
                            outlined
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="fin" no-title @input="ver_fin = false">
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                      <v-text-field
                        v-model="tramite"
                        label="Tramite"
                        dense
                        outlined
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                      <v-text-field
                        v-model="empresa"
                        label="Empresa"
                        dense
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col align="left">
                      <v-btn color="primary" @click="limpiar">
                        LIMPIAR
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
                <!-- FIN FILTROS DE BUSQUEDA -->
              </v-col>
            </v-row>
          </v-container>
        </transition>
      </v-col>
      <!-- END Section Filter -->
    </v-row>
    </section>
    <v-col>
    </v-col>
    <!-- INICO DE SECCION DE DATA TABLE -->
    <section>
    <v-container style="border:1px solid #ddd;
      -moz-border-radius: 7px; -webkit-border-radius: 7px;">
    <v-data-table
      fixed-header
      :headers="headers"
      :url.sync="url"
      :items="items"
      :loading="loading"
      :search="query"
      :custom-filter="especialFiltro"
      rowsperpagetext="Filas por pagina"
      loading-text="Cargando registros..."
      :footer-props="{
        itemsPerPageOptions: [10, 20, 50],
        itemsPerPageAllText: 'todos',
        itemsPerPageText: 'Filas por pagina',
      }"
    >
      <!-- ALL ITEMS -->
      <template v-slot:[`item.ACTIONS`]="item">
        <v-tooltip top>
          <template  v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="primary"
              @click="verObs(item)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon-component icon="format_list_bulleted" />
            </v-btn>
          </template>
          <span>Observaciones</span>
        </v-tooltip>
      </template>
    </v-data-table>
    </v-container>
    </section>
    <!-- FIN DE SECCION DE DATA TABLE -->
  </v-card>
</template>
<script>
/* eslint-disable max-lines-per-function */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-lines */
import actions from '@/plugins/crud-table/mixins/crud-table';
import dayjs from 'dayjs';
import { mapState } from 'vuex';

const urlMisTramites = 'juridico/observados';

export default {
  mixins: [actions],
  data: () => ({
    showFilter: false,
    dialog: false,
    loading: true,
    items: [],
    url: urlMisTramites,
    ver_inicio: false,
    inicio: null,
    ver_fin: false,
    fin: null,
    totalItems: 0,
    query: '',
    tramite: '',
    empresa: '',
    options: {
      pagina: 1,
      itemsPerPage: 50,
    },
    attribute: 'filas',
    filters: {
      type: Array,
      default: () => [],
    },
    idRefresh: {
      type: String,
      default: 'btn-refresh-list',
    },
    idFilter: {
      type: String,
      default: 'btn-filter-list',
    },
  }),
  mounted() {
    this.$nextTick(() => {
      try {
        this.getData();
      } catch (error) {
        this.$message.error(
          error.message ?? error.mensaje ?? 'Ocurrio un error',
        );
      }
    });
  },
  computed: {
    ...mapState(['modal', 'icon']),
    headers() {
      return [
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
          value: 'parametrica.tipo',
        },
        {
          text: 'Trámite',
          sortable: true,
          align: 'left',
          value: 'parametrica.nombre',
          filter: value => {
            if (!this.tramite) return true;
            return value.toUpperCase().includes(this.tramite.toUpperCase());
          },
        },
        {
          text: 'Código',
          align: 'left',
          value: 'codigo',
          sortable: false,
        },
        {
          text: 'Empresa',
          sortable: true,
          align: 'left',
          value: 'empresa.razonSocial',
          filter: value => {
            if (!this.empresa) return true;
            return value.toUpperCase().includes(this.empresa.toUpperCase());
          },
        },
        {
          text: 'Fecha de Observacion',
          sortable: true,
          align: 'left',
          value: 'fechaObservacion',
          filter: value => {
            if (!this.inicio && !this.fin) return true;
            if (this.inicio && this.fin) {
              return value >= this.inicio && value <= dayjs(dayjs(this.fin).add(1, 'day'))
                .format('YYYY-MM-DD');
            }
            if (this.inicio) return value >= this.inicio;
            if (this.fin) {
              return value <= dayjs(dayjs(this.fin).add(1, 'day')).format('YYYY-MM-DD');
            }
          },
        },
      ];
    },
  },
  methods: {
    especialFiltro() {},
    limpiar() {
      this.inicio = null;
      this.fin = null;
      this.tramite = '';
      this.empresa = '';
    },
    recarga() {
      this.totalItems = 0;
      this.options.pagina = 1;
      this.getData();
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },
    /**
     * @function getData
     * @description Obtener los registros para el crudTable
     * @author dbarra@agetic.gob.bo
     */
    async getData() {
      try {
        this.loading = true;
        if (this.url.includes('null')) {
          this.setPropsDataTable();
          return;
        }
        if (this.itemsPerPage) {
          this.options.itemsPerPage = this.itemsPerPage;
        }
        let data = await this.$service.list(
          this.url,
          this.getQuery({
            options: this.options,
            search: {},
          }),
        );
        if (data?.datos && !data.datos.errores) {
          data = data.datos;
          const items = data[this.attribute];
          this.loading = false;
          this.items = items;
          this.totalItems = data.total;
        } else {
          this.setPropsDataTable();
          throw new Error(data.mensaje);
        }
        const paginas = this.totalItems / this.options.itemsPerPage;
        for (let i = 0; i < Math.ceil(paginas); i++) {
          this.options.pagina = this.options.pagina + 1;
          data = await this.$service.list(
            this.url,
            this.getQuery({
              options: this.options,
              search: {},
            }),
          );
          if (data?.datos && !data.datos.errores) {
            data = data.datos;
            const items = data[this.attribute];
            this.loading = false;
            this.items = this.items.concat(items);
          } else {
            this.setPropsDataTable();
            throw new Error(data.mensaje);
          }
        }
      } catch (error) {
        this.$message.error(
          error.message ?? error.mensaje ?? 'Ocurrio un error',
        );
      }
    },
    setPropsDataTable(loading = false, items = [], count = 0) {
      this.loading = loading;
      this.items = items;
      this.totalItems = count;
    },
    verObs() {
      // console.log(val.item.id);
      this.dialog = true;
    },
    filtrar() {
      this.limpiar();
      this.showFilter = !this.showFilter;
    }
  },
};
</script>
