import log = require('loglevel');

import { sanitizeFilename } from '../../utils';
import { inferTitle } from '../../infer';
import { DEFAULT_APP_NAME } from '../../constants';

type NameParamsProvided = {
  nameToUse: string;
  platform: string;
};

type NameParamsNeedsInfer = {
  targetUrl: string;
  platform: string;
};

type NameParams = NameParamsProvided | NameParamsNeedsInfer;

async function tryToInferName(targetUrl: string): Promise<string> {
  try {
    const pageTitle = await inferTitle(targetUrl);
    return pageTitle || DEFAULT_APP_NAME;
  } catch (error) {
    log.warn(
      `Unable to automatically determine app name, falling back to '${DEFAULT_APP_NAME}'. Reason: ${error}`,
    );
    return DEFAULT_APP_NAME;
  }
}

export async function name(params: NameParams): Promise<string> {
  if ('nameToUse' in params) {
    return sanitizeFilename(params.platform, params.nameToUse);
  }

  const inferredName = await tryToInferName(params.targetUrl);
  return sanitizeFilename(params.platform, inferredName);
}