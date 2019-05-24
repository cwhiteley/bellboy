import { DynamicProcessor, Job } from '../src';
import { CustomDestination } from './helpers';

beforeAll(async () => {
});

beforeEach(async () => {
});

afterEach(async () => {
});

afterAll(async () => {
});

it(`destination shouldn't load anything if job is in preview mode`, async () => {
    const destination = new CustomDestination({});
    const processor = new DynamicProcessor({
        generator: async function* () {
            for (let i = 0; i < 10; i++) {
                yield `test${i}`;
            }
        }
    });
    const job = new Job(processor, [destination], {
        previewMode: true,
    });
    await job.run();
    expect(destination.getData()).toEqual([]);
});

it(`destination should load if job is in preview mode and destination preview mode is enabled`, async () => {
    const destination = new CustomDestination({
        previewMode: {
            enabled: true,
        },
    });
    const processor = new DynamicProcessor({
        generator: async function* () {
            for (let i = 0; i < 3; i++) {
                yield `test${i}`;
            }
        }
    });
    const job = new Job(processor, [destination], {
        previewMode: true,
    });
    await job.run();
    expect(destination.getData()).toEqual([
        'test0',
        'test1',
        'test2',
    ]);
});

it(`destination shouldn't load more than 10 rows if in preview mode`, async () => {
    const destination = new CustomDestination({
        previewMode: {
            enabled: true,
        },
    });
    const processor = new DynamicProcessor({
        generator: async function* () {
            for (let i = 0; i < 100; i++) {
                yield `test${i}`;
            }
        }
    });
    const job = new Job(processor, [destination], {
        previewMode: true,
    });
    await job.run();
    expect(destination.getData().length).toEqual(10);
});

it(`destination should respect previewMode's rowLimit if in preview mode`, async () => {
    const destination = new CustomDestination({
        previewMode: {
            enabled: true,
            rowLimit: 33,
        },
    });
    const processor = new DynamicProcessor({
        generator: async function* () {
            for (let i = 0; i < 100; i++) {
                yield `test${i}`;
            }
        }
    });
    const job = new Job(processor, [destination], {
        previewMode: true,
    });
    await job.run();
    expect(destination.getData().length).toEqual(33);
});

it(`destination should respect previewMode's batchSize if in preview mode`, async () => {
    const destination = new CustomDestination({
        previewMode: {
            enabled: true,
            batchSize: 2,
        },
    });
    const processor = new DynamicProcessor({
        generator: async function* () {
            for (let i = 0; i < 100; i++) {
                yield `test${i}`;
            }
        }
    });
    const job = new Job(processor, [destination], {
        previewMode: true,
    });
    await job.run();
    expect(destination.getBatchCount()).toEqual(5);
});

it(`destination should respect previewMode's recordGenerator if in preview mode`, async () => {
    const destination = new CustomDestination({
        recordGenerator: async function* (row) {
            yield `${row} not preview`;
        },
        previewMode: {
            enabled: true,
            recordGenerator: async function* (row) {
                yield `${row} preview`;
            }
        },
    });
    const processor = new DynamicProcessor({
        generator: async function* () {
            for (let i = 0; i < 3; i++) {
                yield `test${i}`;
            }
        }
    });
    const job = new Job(processor, [destination], {
        previewMode: true,
    });
    await job.run();
    expect(destination.getData()).toEqual([
        'test0 preview',
        'test1 preview',
        'test2 preview',
    ]);
});

it(`destination should respect previewMode's batchTransformer if in preview mode`, async () => {
    const destination = new CustomDestination({
        batchTransformer: async function () {
            return ['Good bye, World!'];
        },
        previewMode: {
            enabled: true,
            batchTransformer: async function () {
                return ['Hello, World!'];
            }
        },
    });
    const processor = new DynamicProcessor({
        generator: async function* () {
            for (let i = 0; i < 100; i++) {
                yield `test${i}`;
            }
        }
    });
    const job = new Job(processor, [destination], {
        previewMode: true,
    });
    await job.run();
    expect(destination.getData()).toEqual([
        'Hello, World!',
    ]);
});