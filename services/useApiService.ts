import { useCallback } from 'react';

import { useFetch } from '@/hooks/useFetch';

export interface GetModelsRequestProps {
  key: string;
}

const useApiService = () => {
  const fetchService = useFetch();

  // const getModels = useCallback(
  // 	(
  // 		params: GetManagementRoutineInstanceDetailedParams,
  // 		signal?: AbortSignal
  // 	) => {
  // 		return fetchService.get<GetManagementRoutineInstanceDetailed>(
  // 			`/v1/ManagementRoutines/${params.managementRoutineId}/instances/${params.instanceId
  // 			}?sensorGroupIds=${params.sensorGroupId ?? ''}`,
  // 			{
  // 				signal,
  // 			}
  // 		);
  // 	},
  // 	[fetchService]
  // );

  const getModels = useCallback(
    (params: GetModelsRequestProps, signal?: AbortSignal) => {
      return fetchService.get('http://dev-7b-api.recursal-dev.com:40935' + `/v1/models/models`, {
       
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      }).then((response:any) => {
        return response.data.map((model: any) => {
          return {
            id: model.id,
            name: model.id,
          };
        })
      })
        ;
    },
    [fetchService],
  );

  return {
    getModels,
  };
};

export default useApiService;
