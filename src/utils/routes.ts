export interface BoardDetailsParams {
  uuid: string;
}

const Routes = {
  home: {
    pattern: '/',
    getPath: () => '/'
  },
  details: {
    pattern: '/board/:uuid',
    getPath: (params: BoardDetailsParams) => '/board/:uuid'.replace(':uuid', params.uuid)
  }
}

export default Routes;