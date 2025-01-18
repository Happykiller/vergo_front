import { Inversify } from "@src/commons/inversify";
import GraphqlService from "@services/graphql/graphql.service";

export class GraphqlServiceFetch implements GraphqlService {

  constructor(
    private inversify:Inversify
  ){}

  async send(datas: any): Promise<any> {
    try {
      const storage = JSON.parse(localStorage.getItem("vergo-storage")??"");
      const token = storage?.state.access_token;

      const response = await fetch(process.env.API_URL+'/graphql', {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token??'token'}`
        },
        body: JSON.stringify(datas)
      });

      const responseJson = response.json();

      return responseJson;
    } catch(e:any) {
      this.inversify.loggerService.error(e.message);
    }
  }
} 