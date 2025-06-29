import React from 'react';

const RTL: React.FC = () => {
  return (
    <div dir="rtl" style={{ textAlign: 'right' }}>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="mb-3">RTL Dashboard</h4>
          <p className="text-muted">هذا مثال على لوحة تحكم باللغة العربية مع دعم RTL</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card admin-stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1 opacity-75 small">المبيعات اليومية</h6>
                  <h4 className="mb-2 fw-bold">$53,000</h4>
                  <p className="mb-0 small opacity-75">
                    <span className="fw-bold text-success">+55%</span>
                    منذ أمس
                  </p>
                </div>
                <div className="text-start">
                  <div className="icon bg-primary">
                    <i className="fas fa-coins"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card admin-stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1 opacity-75 small">المستخدمون اليوم</h6>
                  <h4 className="mb-2 fw-bold">2,300</h4>
                  <p className="mb-0 small opacity-75">
                    <span className="fw-bold text-success">+3%</span>
                    منذ الأسبوع الماضي
                  </p>
                </div>
                <div className="text-start">
                  <div className="icon bg-danger">
                    <i className="fas fa-globe"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card admin-stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1 opacity-75 small">العملاء الجدد</h6>
                  <h4 className="mb-2 fw-bold">+3,462</h4>
                  <p className="mb-0 small opacity-75">
                    <span className="fw-bold text-danger">-2%</span>
                    منذ الربع الماضي
                  </p>
                </div>
                <div className="text-start">
                  <div className="icon bg-success">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card admin-stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1 opacity-75 small">المبيعات</h6>
                  <h4 className="mb-2 fw-bold">$103,430</h4>
                  <p className="mb-0 small opacity-75">
                    <span className="fw-bold text-success">+5%</span>
                    مقارنة بالشهر الماضي
                  </p>
                </div>
                <div className="text-start">
                  <div className="icon bg-warning">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Cards */}
      <div className="row mb-4">
        <div className="col-lg-8 mb-4">
          <div className="card admin-card">
            <div className="card-header">
              <h6 className="mb-0">نظرة عامة على المبيعات</h6>
            </div>
            <div className="card-body">
              <div className="text-center py-5">
                <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                <h5>رسم بياني للمبيعات</h5>
                <p className="text-muted">سيتم عرض الرسم البياني هنا</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card admin-card">
            <div className="card-header">
              <h6 className="mb-0">الإشعارات</h6>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle p-2 me-3">
                      <i className="fas fa-bell"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">مبيعات جديدة</h6>
                      <p className="mb-0 text-muted small">تم تسجيل 5 مبيعات جديدة</p>
                    </div>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center">
                    <div className="bg-success text-white rounded-circle p-2 me-3">
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">مستخدم جديد</h6>
                      <p className="mb-0 text-muted small">انضم أحمد محمد للنظام</p>
                    </div>
                  </div>
                </div>
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning text-white rounded-circle p-2 me-3">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">تنبيه النظام</h6>
                      <p className="mb-0 text-muted small">تحقق من إعدادات الأمان</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="row">
        <div className="col-12">
          <div className="card admin-card">
            <div className="card-header">
              <h6 className="mb-0">جدول البيانات</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive admin-table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>المنصب</th>
                      <th>المكتب</th>
                      <th>العمر</th>
                      <th>تاريخ البدء</th>
                      <th>الراتب</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>أحمد علي</td>
                      <td>محاسب</td>
                      <td>طوكيو</td>
                      <td>33</td>
                      <td>2008/11/28</td>
                      <td>$162,700</td>
                    </tr>
                    <tr>
                      <td>فاطمة محمد</td>
                      <td>مدير تنفيذي</td>
                      <td>لندن</td>
                      <td>47</td>
                      <td>2009/10/09</td>
                      <td>$1,200,000</td>
                    </tr>
                    <tr>
                      <td>محمد حسن</td>
                      <td>مطور برمجيات</td>
                      <td>سان فرانسيسكو</td>
                      <td>28</td>
                      <td>2011/06/07</td>
                      <td>$206,850</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-5 pt-4">
        <div className="row">
          <div className="col-lg-6">
            <div className="text-center text-lg-start">
              <p className="text-muted mb-0">
                © {new Date().getFullYear()}, مصنوع بـ <i className="fas fa-heart text-danger"></i> بواسطة
                <a href="https://www.creative-tim.com" className="text-decoration-none me-1" target="_blank" rel="noopener noreferrer">
                  Creative Tim
                </a>
                لشبكة أفضل.
              </p>
            </div>
          </div>
          <div className="col-lg-6">
            <ul className="nav justify-content-center justify-content-lg-end">
              <li className="nav-item">
                <a href="https://www.creative-tim.com" className="nav-link text-muted" target="_blank" rel="noopener noreferrer">
                  Creative Tim
                </a>
              </li>
              <li className="nav-item">
                <a href="https://www.creative-tim.com/presentation" className="nav-link text-muted" target="_blank" rel="noopener noreferrer">
                  من نحن
                </a>
              </li>
              <li className="nav-item">
                <a href="https://creative-tim.com/blog" className="nav-link text-muted" target="_blank" rel="noopener noreferrer">
                  المدونة
                </a>
              </li>
              <li className="nav-item">
                <a href="https://www.creative-tim.com/license" className="nav-link text-muted" target="_blank" rel="noopener noreferrer">
                  الترخيص
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RTL; 