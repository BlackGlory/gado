import { IFiniteStateMachineSchema } from '@blackglory/structures'

export enum WorkerStatus {
  Idle = 'idle'
, Starting = 'starting'
, Running = 'running'
, Aborting = 'aborting'
}

type Event = 'start' | 'started' | 'abort' | 'end'

export const schema: IFiniteStateMachineSchema<WorkerStatus, Event> = {
  [WorkerStatus.Idle]: {
    start: WorkerStatus.Starting
  }
, [WorkerStatus.Starting]: {
    started: WorkerStatus.Running
  , abort: WorkerStatus.Aborting
  }
, [WorkerStatus.Running]: {
    abort: WorkerStatus.Aborting
  , end: WorkerStatus.Idle 
  }
, [WorkerStatus.Aborting]: {
    end: WorkerStatus.Idle 
  }
}

export interface IAPI {
  run(filename: string, params: unknown): Promise<void>
  getStatus(): WorkerStatus
  abort(): void
}
