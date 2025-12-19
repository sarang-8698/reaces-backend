const traces = require("../data/traces.json");

const getTraces = (req, res) => {
  let result = [...traces];

  const {
    status,
    anomalous,
    sensitive,
    pii,
    search,
    timeRange,
    page = 1,
    limit = 10,
    activeCards,
  } = req.query;

  // Parse activeCards if it's a string
  let activeFilters = [];
  if (activeCards) {
    try {
      activeFilters = JSON.parse(activeCards);
    } catch {
      activeFilters = activeCards.split(",");
    }
  }

  // Apply card filters
  if (activeFilters.length > 0) {
    result = result.filter((t) => {
      return activeFilters.some((filter) => {
        if (filter === "failed") return t.status === "failed";
        if (filter === "anomalous") return t.isAnomalous === true;
        if (filter === "dataExposure") return t.hasSensitiveData === true;
        if (filter === "pii") return t.hasSensitiveData === true;
        return false;
      });
    });
  }

  // Legacy filters
  if (status) {
    result = result.filter((t) => t.status === status);
  }

  if (anomalous === "true") {
    result = result.filter((t) => t.isAnomalous === true);
  }

  if (sensitive === "true" || pii === "true") {
    result = result.filter((t) => t.hasSensitiveData === true);
  }

  // Search only by Trace ID (001 to 025)
  if (search && search.trim()) {
    const searchValue = search.trim();
    // Extract numbers from search (e.g., "001", "1", "trace-001" -> "001" or "1")
    const searchNum = searchValue.replace(/\D/g, "");

    result = result.filter((t) => {
      if (!t.id) return false;

      // Extract numbers from trace ID (e.g., "trace-001" -> "001")
      const traceIdNum = t.id.replace(/\D/g, "");

      // Match exact number or partial match
      // "001" matches "trace-001"
      // "1" matches "trace-001", "trace-010", "trace-021" (any trace with "1" in number)
      if (searchNum) {
        return traceIdNum.includes(searchNum) || searchNum === traceIdNum;
      }

      // Also support full trace ID search (e.g., "trace-001")
      return t.id.toLowerCase().includes(searchValue.toLowerCase());
    });
  }

  // Time range filter
  if (timeRange && timeRange !== "all") {
    const now = new Date();
    let cutoff;

    switch (timeRange) {
      case "1h":
        cutoff = new Date(now - 60 * 60 * 1000);
        break;
      case "24h":
        cutoff = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        cutoff = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        cutoff = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoff = null;
    }

    if (cutoff) {
      result = result.filter((t) => new Date(t.timestamp) >= cutoff);
    }
  }

  const startIndex = (page - 1) * limit;
  const paginatedData = result.slice(startIndex, startIndex + Number(limit));

  res.json({
    total: result.length,
    page: Number(page),
    limit: Number(limit),
    data: paginatedData,
  });
};

const getMetrics = (req, res) => {
  const failedRuns = traces.filter((t) => t.status === "failed").length;
  const anomalousRuns = traces.filter((t) => t.isAnomalous).length;
  const sensitiveRuns = traces.filter((t) => t.hasSensitiveData).length;

  res.json({
    failedRuns,
    anomalousRuns,
    dataExposureRuns: sensitiveRuns,
    piiRuns: sensitiveRuns,
  });
};

module.exports = { getTraces, getMetrics };
