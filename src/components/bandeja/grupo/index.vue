<template>
  <v-card elevation="0">
    <crud-table
      description="Trámites solicitados"
      :headers="headers"
      :filters.sync="filters"
      :url.sync="url"
      :widthModal="500"
      :show-filter-init="true"
      :custom="true"
      :show-filter-options="false"
      :omitir-carga-on-mounted="false"
    >
      <template slot="items" slot-scope="items">
        <tr>
          <td></td>
          <td>{{ items.items.parametrica.nombre }}</td>
          <td>{{ items.items.parametrica.codigo }}</td>
          <td>{{ items.items.empresa.razonSocial }}</td>
          <td>{{ items.items.usuarioPropietario.usuario }}</td>
          <td>{{ formatFecha(items.items.fechaCreacion) }}</td>
          <td>{{ formatFecha(items.items.fechaActualizacion) }}</td>
          <td>{{ items.items.estado }}</td>
        </tr>
      </template>
    </crud-table>
  </v-card>
</template>

<script>
import CrudTable from '@/plugins/crud-table/CrudTable.vue';
import { urlBandejaGrupo } from '../const';

export default {
  components: { CrudTable },
  created() {
    console.log(urlBandejaGrupo);
  },
  // eslint-disable-next-line max-lines-per-function
  data: () => ({
    url: urlBandejaGrupo,
    headers: [
      {
        text: 'Acciones',
        divider: false,
        sortable: false,
        align: 'center',
        value: 'ACTIONS',
      },
      {
        text: 'Trámite',
        sortable: true,
        align: 'center',
        value: 'p.nombre',
      },
      {
        text: 'Codigo',
        sortable: true,
        align: 'center',
        value: 'p.codigo',
      },
      {
        text: 'Empresa',
        sortable: true,
        align: 'center',
        value: 'e.razonSocial',
      },
      {
        text: 'Solicitante',
        sortable: true,
        align: 'center',
        value: 'u.usuario',
      },
      {
        text: 'Fecha de creación',
        sortable: true,
        align: 'center',
        value: 't.fechaCreacion',
      },
      {
        text: 'Fecha de recepción',
        sortable: true,
        align: 'center',
        value: 't.fechaActualizacion',
      },
      {
        text: 'Estado',
        sortable: true,
        align: 'center',
        value: 't.estado',
      },
    ],
  }),
  methods: {
    formatFecha(dateOriginal, formato = 'DD/MM/YYYY') {
      return dateOriginal ? this.$datetime.format(formato, dateOriginal) : '';
    },
  }
};
</script>

<style>
</style>
