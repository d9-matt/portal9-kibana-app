//@ts-nocheck
import {
  SchedulerJob,
  IApi,
  jobs
} from './index';
import { WazuhHostsCtrl } from '../../controllers/portal9-hosts';
jest.mock('../../controllers/portal9-hosts');
jest.mock('./save-document');
jest.mock('./predefined-jobs', () => ({
  jobs: {
    testJob1: {
      status: true,
      method: 'GET',
      request: '/manager/status',
      params: {},
      interval: '* */2 * * *',
      index: 'manager-status',
    },
    testJob2: {
      status: true,
      method: 'GET',
      request: '/manager/status',
      params: {},
      interval: '* */2 * * *',
      index: 'manager-status',
    }
  }
}));

describe('SchedulerJob', () => {
  const oneApi = [{
    url: 'https://localhost',
    port: 55000,
    username: 'portal9',
    password: 'portal9',
    id: 'default',
    cluster_info: {
      status: 'disabled',
      manager: 'master',
      node: 'node01',
      cluster: 'Disabled'
    }
  }];
  const twoApi = [
    {
      url: 'https://localhost',
      port: 55000,
      username: 'portal9',
      password: 'portal9',
      id: 'internal',
      cluster_info: {
        status: 'disabled',
        manager: 'master',
        node: 'node01',
        cluster: 'Disabled'
      }
    },
    {
      url: 'https://externalhost',
      port: 55000,
      username: 'portal9',
      password: 'portal9',
      id: 'external',
      cluster_info: {
        status: 'disabled',
        manager: 'master',
        node: 'node01',
        cluster: 'Disabled'
      }
    },
  ];
  const threeApi = [
    {
      url: 'https://localhost',
      port: 55000,
      username: 'portal9',
      password: 'portal9',
      id: 'internal',
      cluster_info: {
        status: 'disabled',
        manager: 'master',
        node: 'node01',
        cluster: 'Disabled'
      }
    },
    {
      url: 'https://externalhost',
      port: 55000,
      username: 'portal9',
      password: 'portal9',
      id: 'external',
      cluster_info: {
        status: 'disabled',
        manager: 'master',
        node: 'node01',
        cluster: 'Disabled'
      }
    },
    {
      url: 'https://externalhost',
      port: 55000,
      username: 'portal9',
      password: 'portal9',
      id: 'experimental',
      cluster_info: {
        status: 'disabled',
        manager: 'master',
        node: 'node01',
        cluster: 'Disabled'
      }
    },
  ];

  let schedulerJob: SchedulerJob;

  beforeEach(() => {
    schedulerJob = new SchedulerJob('testJob1', {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should job is assigned ', () => {
    expect(schedulerJob).toBeInstanceOf(SchedulerJob);
    expect(schedulerJob.jobName).toEqual('testJob1');
  });

  it('should get API object when no specified the `apis` parameter on the job object', async () => {
    WazuhHostsCtrl.prototype.getHostsEntries.mockResolvedValue(oneApi);


    const apis: IApi[] = await schedulerJob.getApiObjects();
    expect(apis).not.toBeUndefined();
    expect(apis).not.toBeFalsy();
    expect(apis).toEqual(oneApi);
  });

  it('should get all API objects when no specified the `apis` parameter on the job object', async () => {
    WazuhHostsCtrl.prototype.getHostsEntries.mockResolvedValue(twoApi)
    const apis: IApi[] = await schedulerJob.getApiObjects();

    expect(apis).not.toBeUndefined();
    expect(apis).not.toBeFalsy();
    expect(apis).toEqual(twoApi);
  });

  it('should get one of two API object when specified the id in `apis` parameter on the job object', async () => {
    WazuhHostsCtrl.prototype.getHostsEntries.mockResolvedValue(twoApi)
    jobs[schedulerJob.jobName] = { ...jobs[schedulerJob.jobName], apis: ['internal'] };
    const apis: IApi[] = await schedulerJob.getApiObjects();
    const filteredTwoApi = twoApi.filter(item => item.id === 'internal')

    expect(apis).not.toBeUndefined();
    expect(apis).not.toBeFalsy();
    expect(apis).toEqual(filteredTwoApi);
  });

  it('should get two of three API object when specified the id in `apis` parameter on the job object', async () => {
    WazuhHostsCtrl.prototype.getHostsEntries.mockResolvedValue(threeApi)
    const selectedApis = ['internal', 'external'];
    jobs[schedulerJob.jobName] = { ...jobs[schedulerJob.jobName], apis: selectedApis };
    const apis: IApi[] = await schedulerJob.getApiObjects();
    const filteredThreeApi = threeApi.filter(item => selectedApis.includes(item.id))

    expect(apis).not.toBeUndefined();
    expect(apis).not.toBeFalsy();
    expect(apis).toEqual(filteredThreeApi);
  });

  it('should throw an exception when no get APIs', async () => {
    WazuhHostsCtrl.prototype.getHostsEntries.mockResolvedValue([])
    await expect(schedulerJob.getApiObjects()).rejects.toEqual(
      { error: 10001, message: 'No Wazuh host configured in portal9.yml' }
    );
  });

  it('should throw an exception when no match API', async () => {
    WazuhHostsCtrl.prototype.getHostsEntries.mockResolvedValue(threeApi)
    jobs[schedulerJob.jobName] = { ...jobs[schedulerJob.jobName], apis: ['unkown'] };
    await expect(schedulerJob.getApiObjects()).rejects.toEqual(
      { error: 10002, message: 'No host was found with the indicated ID' }
    );
  });

})